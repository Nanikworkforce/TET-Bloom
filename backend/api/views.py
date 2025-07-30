from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from rest_framework import viewsets, filters
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import Count
from .models.user import Users
from .models.teachers import Teacher
from .models.observation_groups import ObservationGroup
from .models.schedule import Schedule
from .models.administrators import Administrator
from .serializers import UserSerializer, TeacherSerializer, ObservationGroupSerializer, ScheduleSerializer, AdministratorSerializer
from .utils import send_email
from rest_framework import status

# Create your views here.
def index(request):
    return HttpResponse('Hello world')

@api_view(['GET'])
def TotalStats(request):
    try:
        stats = {
            'total_users': Users.objects.count(),
            'total_teachers': Teacher.objects.count(),
            'total_administrators': Administrator.objects.count(),
            'total_observation_groups': ObservationGroup.objects.count(),
        }
        return Response(stats)
    except Exception as e:
        return Response({'error': str(e)}, status=500)


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

    def create(self, request, *args, **kwargs):
        print("UserViewSet create called with data:", request.data)
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            user = serializer.save()
            send_email(user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            print("Error creating user:", str(e))
            raise

class TeacherViewSet(viewsets.ModelViewSet):
    queryset = Teacher.objects.select_related('user').all()
    serializer_class = TeacherSerializer
    
    def create(self, request, *args, **kwargs):
        print("TeacherViewSet create called with data:", request.data)
        try:
            return super().create(request, *args, **kwargs)
        except Exception as e:
            print("Error creating teacher:", str(e))
            raise

class ObservationGroupViewSet(viewsets.ModelViewSet):
    queryset = ObservationGroup.objects.all()
    serializer_class = ObservationGroupSerializer

class ScheduleViewSet(viewsets.ModelViewSet):
    queryset = Schedule.objects.select_related('teacher__user', 'observation_group__created_by').all()
    serializer_class = ScheduleSerializer

class AdministratorViewSet(viewsets.ModelViewSet):
    queryset = Administrator.objects.all()
    serializer_class = AdministratorSerializer

