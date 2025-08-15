from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from rest_framework import viewsets, filters
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth import authenticate
from django.db.models import Count
from .models.user import Users
from .models.teachers import Teacher
from .models.observation_groups import ObservationGroup
from .models.schedule import Schedule
from .models.administrators import Administrator
from .serializers import UserSerializer, TeacherSerializer, ObservationGroupSerializer, ScheduleSerializer, AdministratorSerializer
from .utils import send_email, generate_password, create_supabase_user
from .notifications import NotificationService
from rest_framework import status
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import User
from django.utils import timezone
from rest_framework.decorators import action
import logging

logger = logging.getLogger(__name__)
# Create your views here.
def index(request):
    return HttpResponse('Hello world')

@api_view(['POST'])
def django_auth_login(request):
    """Django authentication fallback for users created via backend"""
    try:
        email = request.data.get('email')
        password = request.data.get('password')
        
        print(f"Django auth attempt - Email: {email}, Password provided: {bool(password)}")
        
        if not email or not password:
            return Response({'error': 'Email and password required'}, status=400)
        
        # Check if user exists in Users model first
        try:
            users_record = Users.objects.get(email=email)
            print(f"Found Users record: {users_record.name}, Role: {users_record.role}")
        except Users.DoesNotExist:
            print(f"No Users record found for email: {email}")
            return Response({'error': 'User not found'}, status=404)
        
        # Try to find the Django User
        try:
            django_user = User.objects.get(email=email)
            print(f"Found Django user: {django_user.username}, Active: {django_user.is_active}")
        except User.DoesNotExist:
            print(f"No Django User found for email: {email}")
            return Response({'error': 'Authentication user not found'}, status=404)
        
        # Try to authenticate using Django's built-in auth
        # First try with email as username
        user = authenticate(username=email, password=password)
        print(f"Auth attempt with email as username: {bool(user)}")
        
        # If that fails, try with the actual username
        if not user:
            user = authenticate(username=django_user.username, password=password)
            print(f"Auth attempt with username '{django_user.username}': {bool(user)}")
        
        # If authentication fails but user exists and is inactive, check password manually
        if not user and not django_user.is_active:
            from django.contrib.auth.hashers import check_password
            if check_password(password, django_user.password):
                print(f"Password is correct for inactive user: {email}")
                user = django_user  # Use the user even though inactive
            else:
                print(f"Password is incorrect for user: {email}")
        
        if user:
            print(f"Authentication successful for: {email}")
            return Response({
                'id': str(users_record.id),
                'name': users_record.name,
                'email': users_record.email,
                'role': users_record.role,
                'status': users_record.status
            })
        else:
            print(f"Authentication failed for: {email}")
            return Response({'error': 'Invalid credentials'}, status=401)
            
    except Exception as e:
        print(f"Django auth error: {str(e)}")
        return Response({'error': 'Authentication failed'}, status=500)

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
        'user__is_active',
        'user__is_staff',
    ]
    def create(self, request, *args, **kwargs):
            print("UserViewSet create called with data:", request.data)
            try:
                # Check if user already exists
                email = request.data.get('email')
                if Users.objects.filter(email=email).exists():
                    return Response(
                        {'error': f'User with email {email} already exists'}, 
                        status=status.HTTP_400_BAD_REQUEST
                    )
                
                # Also check Django User model for email uniqueness
                if User.objects.filter(email=email).exists():
                    return Response(
                        {'error': f'User with email {email} already exists in auth system'}, 
                        status=status.HTTP_400_BAD_REQUEST
                    )
                
                serializer = self.get_serializer(data=request.data)
                serializer.is_valid(raise_exception=True)
                
                # Create the Users record first
                users_instance = serializer.save()
                
                # Generate password and create Django User
                raw_password = generate_password()
                
                # Create user with unique username
                username = email  # Use email as username
                counter = 1
                while User.objects.filter(username=username).exists():
                    username = f"{email}_{counter}"
                    counter += 1
                
                django_user = User.objects.create(
                    username=username,
                    email=email,
                    password=make_password(raw_password),
                    is_active=False,
                )
                
                # Create user in Supabase as well
                supabase_success = create_supabase_user(
                    email=email,
                    password=raw_password,
                    name=request.data.get('name'),
                    role=request.data.get('role')
                )
                
                if not supabase_success:
                    print(f"Warning: Failed to create Supabase user for {email}")
                
                # Send email using the Users instance (which has the name field)
                send_email(users_instance, raw_password)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            except Exception as e:
                print("Error creating user:", str(e))
                return Response(
                    {'error': f'Failed to create user: {str(e)}'}, 
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

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
    
    def perform_create(self, serializer):
        """Override create to send notification emails when schedules are created"""
        schedule = serializer.save()
        
        # Send notification to teacher(s)
        try:
            if schedule.teacher:
                # Single teacher notification
                self._send_teacher_notification(schedule)
            elif schedule.observation_group:
                # Group observation - notify all teachers in the group
                self._send_group_notifications(schedule)
                
        except Exception as e:
            # Log error but don't fail the schedule creation
            logger.error(f"Failed to send notification for schedule {schedule.id}: {str(e)}")
    
    def _send_teacher_notification(self, schedule):
        """Send notification to a single teacher"""
        teacher = schedule.teacher
        if not teacher or not teacher.user or not teacher.user.email:
            return
            
        # Get observer information
        observer_name = "Administrator"
        if schedule.observation_group and schedule.observation_group.created_by:
            observer_name = schedule.observation_group.created_by.name
        
        # Prepare observation data
        observation_data = {
            'date': schedule.date.strftime('%B %d, %Y'),
            'time': schedule.time.strftime('%I:%M %p'),
            'observation_type': schedule.observation_type,
            'subject': teacher.subject or 'Not specified',
            'grade': teacher.grade or 'Not specified',
            'notes': schedule.notes or '',
        }
        
        # Send notification
        notification_sent = NotificationService.send_observation_scheduled_notification(
            teacher_email=teacher.user.email,
            teacher_name=teacher.user.name,
            observation_data=observation_data,
            observer_name=observer_name
        )
        
        # Update notification tracking
        if notification_sent:
            schedule.notification_sent = True
            schedule.notification_sent_at = timezone.now()
            schedule.save(update_fields=['notification_sent', 'notification_sent_at'])
    
    def _send_group_notifications(self, schedule):
        """Send notifications to all teachers in an observation group"""
        if not schedule.observation_group:
            return
            
        group = schedule.observation_group
        observer_name = group.created_by.name if group.created_by else "Administrator"
        
        # Get all teachers in the group
        teachers = group.teachers.all()
        
        for teacher in teachers:
            if not teacher.user or not teacher.user.email:
                continue
                
            # Prepare observation data for this teacher
            observation_data = {
                'date': schedule.date.strftime('%B %d, %Y'),
                'time': schedule.time.strftime('%I:%M %p'),
                'observation_type': schedule.observation_type,
                'subject': teacher.subject or 'Not specified',
                'grade': teacher.grade or 'Not specified',
                'notes': schedule.notes or '',
                'group_name': group.name,
            }
            
            # Send notification
            NotificationService.send_observation_scheduled_notification(
                teacher_email=teacher.user.email,
                teacher_name=teacher.user.name,
                observation_data=observation_data,
                observer_name=observer_name
            )
        
        # Update notification tracking for the schedule
        schedule.notification_sent = True
        schedule.notification_sent_at = timezone.now()
        schedule.save(update_fields=['notification_sent', 'notification_sent_at'])
    
    @action(detail=True, methods=['post'])
    def send_reminder(self, request, pk=None):
        """Manual endpoint to send reminder notifications"""
        try:
            schedule = self.get_object()
            
            if schedule.teacher:
                # Send reminder to single teacher
                teacher = schedule.teacher
                if teacher.user and teacher.user.email:
                    observer_name = "Administrator"
                    if schedule.observation_group and schedule.observation_group.created_by:
                        observer_name = schedule.observation_group.created_by.name
                    
                    observation_data = {
                        'date': schedule.date.strftime('%B %d, %Y'),
                        'time': schedule.time.strftime('%I:%M %p'),
                        'observation_type': schedule.observation_type,
                        'subject': teacher.subject or 'Not specified',
                        'grade': teacher.grade or 'Not specified',
                        'notes': schedule.notes or '',
                    }
                    
                    # Calculate days until observation
                    days_until = (schedule.date - timezone.now().date()).days
                    
                    reminder_sent = NotificationService.send_observation_reminder_notification(
                        teacher_email=teacher.user.email,
                        teacher_name=teacher.user.name,
                        observation_data=observation_data,
                        observer_name=observer_name,
                        days_until_observation=max(0, days_until)
                    )
                    
                    if reminder_sent:
                        schedule.reminder_sent = True
                        schedule.reminder_sent_at = timezone.now()
                        schedule.save(update_fields=['reminder_sent', 'reminder_sent_at'])
                        
                        return Response({'message': 'Reminder sent successfully'})
                    else:
                        return Response({'error': 'Failed to send reminder'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
            return Response({'error': 'No teacher associated with this schedule'}, status=status.HTTP_400_BAD_REQUEST)
            
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class AdministratorViewSet(viewsets.ModelViewSet):
    queryset = Administrator.objects.all()
    serializer_class = AdministratorSerializer

