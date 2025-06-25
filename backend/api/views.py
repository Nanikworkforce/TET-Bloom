from django.shortcuts import render
from django.http import HttpResponse
from rest_framework import viewsets, filters
from .models.user import Users
from .models.teachers import Teacher
from .serializers import UserSerializer, TeacherSerializer

# Create your views here.
def index(request):
    return HttpResponse('Hello world')


class UserViewSet(viewsets.ModelViewSet):
    queryset = Users.objects.all()
    serializer_class = UserSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = [
        'name',            
        'subject',         
        'grade',           
        'user__email',      
        'user__role',       
        'user__status',     
    ]

class TeacherViewSet(viewsets.ModelViewSet):
    queryset = Teacher.objects.select_related('user').all()
    serializer_class = TeacherSerializer
