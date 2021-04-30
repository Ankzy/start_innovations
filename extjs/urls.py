from django.urls import path
from .views import ext

urlpatterns = [
    path('', ext)
]