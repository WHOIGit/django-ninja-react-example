
from ninja import NinjaAPI, Schema
from ninja.security import HttpBearer
from django.contrib.auth import authenticate, login, logout
from rest_framework.authtoken.models import Token
from django.views.decorators.csrf import csrf_protect

from django.http import JsonResponse
import json

api = NinjaAPI(auth=None)


class BearerAuth(HttpBearer):
    def authenticate(self, request, token):
        try:
            token_obj = Token.objects.get(key=token)
            return token_obj.user
        except Token.DoesNotExist:
            return None

class SessionAuth:
    def __call__(self, request):
        if request.user.is_authenticated:
            return request.user
        return None


@api.post("/login")
def login_view(request):
    data = json.loads(request.body)
    username = data.get('username')
    password = data.get('password')

    if username is None or password is None:
        return JsonResponse({
            'success': False,
            'error': 'Please enter a username and password'
        })

    user = authenticate(username=username, password=password)
    if user is None:
        return JsonResponse({
            'success': False,
            'error': 'Invalid username or password'
        }, status=400)

    login(request, user)

    return JsonResponse({
        'success': True,
        'username': user.username,
    })

@api.get("/logout")
def logout_view(request):
    if not request.user.is_authenticated:
        return JsonResponse({
            "detail": "Not logged in"
        }, status=400)

    logout(request)

    return JsonResponse({
        "detail": "Successful logout"
    })

@api.get("/session")
def session_view(request):
    if not request.user.is_authenticated:
        return JsonResponse({
            "isAuthenticated": False
        })

    return JsonResponse({
        "isAuthenticated": True,
        "username": request.user.username
    })

class MessageUpdate(Schema):
    new_message: str

@api.put("/message", auth=[BearerAuth(), SessionAuth()])
@csrf_protect
def update_message(request, data: MessageUpdate):
    return {
        "status": "success",
        "message": f"Thanks for sending '{data.new_message}', {request.user.username}!"
    }

class AuthInfo(Schema):
    username: str
    password: str

@api.post("/api-token-auth")
def create_auth_token(request, data: AuthInfo):
    user = authenticate(username=data.username, password=data.password)
    if user is not None:
        token, created = Token.objects.get_or_create(user=user)
        return {"token": token.key}
    else:
        return {"error": "Invalid credentials"}, 401