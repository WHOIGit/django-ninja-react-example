from django.views.decorators.csrf import ensure_csrf_cookie
from ninja import NinjaAPI, Schema
from ninja.security import HttpBearer
from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse, HttpRequest
from rest_framework.authtoken.models import Token

api = NinjaAPI(auth=None, csrf=True)


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

class MessageUpdate(Schema):
    new_message: str

class AuthInfo(Schema):
    username: str
    password: str


@api.post("/login")
def login_view(request: HttpRequest, data: AuthInfo):
    if data.username is None or data.password is None:
        return JsonResponse({
            'error': 'Please enter a username and password'
        }, status=400)

    user = authenticate(username=data.username, password=data.password)
    if user is None:
        return JsonResponse({
            'error': 'Invalid username or password'
        }, status=400)

    login(request, user)

    return {
        'username': user.username
    }

@api.get("/logout")
def logout_view(request: HttpRequest):
    if not request.user.is_authenticated:
        return JsonResponse({
            "error": "Not logged in"
        }, status=400)

    logout(request)

    return {
        "message": "Successful logout"
    }

@api.get("/session")
@ensure_csrf_cookie
def session_view(request: HttpRequest):
    if not request.user.is_authenticated:
        return JsonResponse({
            "isAuthenticated": False
        })

    return JsonResponse({
        "isAuthenticated": True,
        "username": request.user.username
    })

@api.put("/message", auth=[BearerAuth(), SessionAuth()])
def update_message(request, data: MessageUpdate):
    return {
        "message": f"Thanks for sending '{data.new_message}', {request.user.username}!"
    }

@api.post("/api-token-auth")
def create_auth_token(request: HttpRequest, data: AuthInfo):
    user = authenticate(username=data.username, password=data.password)
    if user is None:
        return JsonResponse({
            "error": "Invalid credentials"
        }, status=401)

    token, created = Token.objects.get_or_create(user=user)

    return {
        "token": token.key
    }
