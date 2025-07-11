from django.shortcuts import render
from django.http import HttpResponse
from rest_framework import viewsets, filters
from .models.user import Users
from .models.teachers import Teacher
from .models.observation_groups import ObservationGroup
from .models.schedule import Schedule
from .models.administrators import Administrator
from .serializers import UserSerializer, TeacherSerializer, ObservationGroupSerializer, ScheduleSerializer, AdministratorSerializer

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

class ObservationGroupViewSet(viewsets.ModelViewSet):
    queryset = ObservationGroup.objects.all()
    serializer_class = ObservationGroupSerializer

class ScheduleViewSet(viewsets.ModelViewSet):
    queryset = Schedule.objects.all()
    serializer_class = ScheduleSerializer

class AdministratorViewSet(viewsets.ModelViewSet):
    queryset = Administrator.objects.all()
    serializer_class = AdministratorSerializer

