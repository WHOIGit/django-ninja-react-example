from ninja import NinjaAPI, Schema
from ninja.security import HttpBearer
from django.contrib.auth.models import User
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_protect
from rest_framework.authtoken.models import Token

class BearerAuth(HttpBearer):
    def authenticate(self, request, token):
        try:
            token_obj = Token.objects.get(key=token)
            return token_obj.user
        except Token.DoesNotExist:
            return None

class SessionAuth(HttpBearer):
    @method_decorator(csrf_protect)
    def authenticate(self, request, token):
        if request.user.is_authenticated:
            return request.user
        return None

api = NinjaAPI(auth=None)

message = {"content": "Hello, World!"}

class MessageUpdate(Schema):
    new_message: str

@api.get("/message")
def get_message(request):
    return message

@api.put("/message", auth=[BearerAuth(), SessionAuth()])
def update_message(request, data: MessageUpdate):
    message["content"] = data.new_message
    return {"status": "success", "message": message["content"]}

@api.get("/auth_status")
def auth_status(request):
    return {"is_authenticated": request.user.is_authenticated}

# New endpoint to create a token for a user

class AuthInfo(Schema):
    username: str
    password: str

@api.post("/api-token-auth")
def create_auth_token(request, data: AuthInfo):
    try:
        user = User.objects.get(username=data.username)
        if user.check_password(data.password):
            token, created = Token.objects.get_or_create(user=user)
            return {"token": token.key}
        else:
            return {"error": "Invalid credentials"}
    except User.DoesNotExist:
        return {"error": "User does not exist"}