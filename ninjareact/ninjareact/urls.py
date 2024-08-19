from django.contrib import admin
from django.urls import path
from api.views import react_app
from api.api import api

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', react_app, name='react_app'),
    path('api/', api.urls),
]
