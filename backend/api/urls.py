from django.urls import path
from .views import *
from rest_framework import routers

router = routers.DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'teachers', TeacherViewSet)

urlpatterns = [
    path('', index, name='index'),
]
