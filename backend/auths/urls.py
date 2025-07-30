from django.urls import path, include
from .views import *
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
urlpatterns = [
    path('register/', RegisterAPIView.as_view(), name='register'),
    path('login/', LoginAPIView.as_view(), name='login'),
    path('verify-email/',VerifyEmailViewSet.as_view({'get':'verify'}),name='verify-email'),
    path('request-password-reset/',RequestPasswordResetEmail.as_view(),name='request-password-reset'),
    path('password-reset/',VerifyPasswordReset.as_view(),name='password-reset'),
    #google auth
    path('google-auth/', GoogleAuthView.as_view(), name='google-auth'),
    path('logout/', LogoutView.as_view(), name='logout'),
]

urlpatterns += router.urls