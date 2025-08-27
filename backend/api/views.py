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
from .models.feedback import Feedback, FeedbackRevision
from .models.lesson_plans import LessonPlan, LessonPlanFeedback
from .serializers import (
    FeedbackRevisionSerializer, FeedbackSerializer, UserSerializer, 
    TeacherSerializer, ObservationGroupSerializer, ScheduleSerializer, 
    AdministratorSerializer, LessonPlanSerializer, LessonPlanFeedbackSerializer
)
from .utils import send_email, generate_password, create_supabase_user
from .notifications import NotificationService
from rest_framework import status
from django.contrib.auth.hashers import make_password
from django.contrib.auth import get_user_model
User = get_user_model()
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
            print(f"Found Django user: {django_user.email}, Active: {django_user.is_active}")
        except User.DoesNotExist:
            print(f"No Django User found for email: {email}")
            return Response({'error': 'Authentication user not found'}, status=404)
        
        # Try to authenticate using Django's built-in auth
        # Try to authenticate using email (which is the USERNAME_FIELD for custom User model)
        user = authenticate(username=email, password=password)
        print(f"Auth attempt with email: {bool(user)}")
        
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
                
                # Create Django User (custom User model uses email as USERNAME_FIELD)
                # For invited users, activate them immediately since they receive credentials
                django_user = User.objects.create(
                    email=email,
                    first_name=users_instance.name.split()[0] if users_instance.name else "",
                    last_name=" ".join(users_instance.name.split()[1:]) if len(users_instance.name.split()) > 1 else "",
                    password=make_password(raw_password),
                    is_active=True,  
                    is_verified=True,)
                
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


class FeedbackViewSet(viewsets.ModelViewSet):
    queryset = Feedback.objects.select_related('schedule', 'teacher__user', 'observer').all()
    serializer_class = FeedbackSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        teacher_id = self.request.query_params.get('teacher')
        if teacher_id:
            queryset = queryset.filter(teacher_id=teacher_id)
        
        observer_id = self.request.query_params.get('observer')
        if observer_id:
            queryset = queryset.filter(observer_id=observer_id)
        
        status_param = self.request.query_params.get('status')
        if status_param:
            queryset = queryset.filter(status=status_param)

        schedule_id = self.request.query_params.get('schedule')
        if schedule_id:
            queryset = queryset.filter(schedule_id=schedule_id)
            
        return queryset.order_by('-created_at')
    
    @action(detail=True, methods=['post'])
    def submit(self, request, pk=None):
        """Submit feedback for review"""
        try:
            feedback = self.get_object()
            if feedback.status != 'draft':
                return Response({'error': 'Only draft feedback can be submitted'}, 
                              status=status.HTTP_400_BAD_REQUEST)
            
            feedback.status = 'submitted'
            feedback.save()
            
            # Send notification to teacher when feedback is submitted
            try:
                # Prepare feedback data for notification
                feedback_data = {
                    'observation_date': feedback.schedule.date.strftime('%B %d, %Y') if feedback.schedule.date else '',
                    'observation_time': feedback.schedule.time.strftime('%I:%M %p') if feedback.schedule.time else '',
                    'observation_type': feedback.schedule.observation_type or '',
                    'subject': feedback.teacher.subject or '',
                    'grade': feedback.teacher.grade or '',
                    'overall_rating': feedback.overall_rating or '',
                    'average_score': feedback.average_score or 0,
                }
                
                # Send notification
                NotificationService.send_feedback_created_notification(
                    teacher_email=feedback.teacher.user.email,
                    teacher_name=feedback.teacher.user.name,
                    feedback_data=feedback_data,
                    observer_name=feedback.observer.name if feedback.observer else None
                )
            except Exception as e:
                # Log the error but don't fail the feedback submission
                import logging
                logger = logging.getLogger(__name__)
                logger.error(f"Failed to send feedback submission notification: {str(e)}")
            
            serializer = self.get_serializer(feedback)
            return Response(serializer.data)
            
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=True, methods=['post'])
    def request_review(self, request, pk=None):
        """Teacher requests review of feedback"""
        try:
            feedback = self.get_object()
            if feedback.status != 'submitted':
                return Response({'error': 'Only submitted feedback can have review requested'}, 
                              status=status.HTTP_400_BAD_REQUEST)
            
            response_comments = request.data.get('response_comments', '')
            if not response_comments:
                return Response({'error': 'Response comments are required'}, 
                              status=status.HTTP_400_BAD_REQUEST)
            
            feedback.status = 'review_requested'
            feedback.teacher_response_comments = response_comments
            feedback.teacher_response_date = timezone.now()
            feedback.save()
            
            # Send notification to observer when teacher requests review
            try:
                # Prepare feedback data for notification
                feedback_data = {
                    'observation_date': feedback.schedule.date.strftime('%B %d, %Y') if feedback.schedule.date else '',
                    'observation_time': feedback.schedule.time.strftime('%I:%M %p') if feedback.schedule.time else '',
                    'observation_type': feedback.schedule.observation_type or '',
                    'subject': feedback.teacher.subject or '',
                    'grade': feedback.teacher.grade or '',
                }
                
                # Send notification
                NotificationService.send_feedback_review_requested_notification(
                    observer_email=feedback.observer.email,
                    observer_name=feedback.observer.name,
                    teacher_name=feedback.teacher.user.name,
                    feedback_data=feedback_data,
                    review_comments=response_comments
                )
            except Exception as e:
                # Log the error but don't fail the review request
                import logging
                logger = logging.getLogger(__name__)
                logger.error(f"Failed to send feedback review notification: {str(e)}")
            
            serializer = self.get_serializer(feedback)
            return Response(serializer.data)
            
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        """Teacher approves feedback"""
        try:
            feedback = self.get_object()
            if feedback.status not in ['submitted', 'revised']:
                return Response({'error': 'Only submitted or revised feedback can be approved'}, 
                              status=status.HTTP_400_BAD_REQUEST)
            
            feedback.status = 'approved'
            feedback.teacher_response_date = timezone.now()
            feedback.save()
            
            # Send notification to administrator when teacher approves feedback
            try:
                # Prepare feedback data for notification
                feedback_data = {
                    'observation_date': feedback.schedule.date.strftime('%B %d, %Y') if feedback.schedule.date else '',
                    'observation_time': feedback.schedule.time.strftime('%I:%M %p') if feedback.schedule.time else '',
                    'observation_type': feedback.schedule.observation_type or '',
                    'subject': feedback.teacher.subject or '',
                    'grade': feedback.teacher.grade or '',
                    'overall_rating': feedback.overall_rating or '',
                    'average_score': feedback.average_score or 0,
                }
                
                # Send notification to administrator
                NotificationService.send_feedback_approved_notification(
                    admin_email=feedback.observer.email,
                    admin_name=feedback.observer.name,
                    teacher_name=feedback.teacher.user.name,
                    feedback_data=feedback_data
                )
            except Exception as e:
                # Log the error but don't fail the approval
                import logging
                logger = logging.getLogger(__name__)
                logger.error(f"Failed to send feedback approval notification: {str(e)}")
            
            serializer = self.get_serializer(feedback)
            return Response(serializer.data)
            
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=True, methods=['post'])
    def revise(self, request, pk=None):
        """Observer revises feedback based on teacher's request"""
        try:
            feedback = self.get_object()
            if feedback.status != 'review_requested':
                return Response({'error': 'Only review requested feedback can be revised'}, 
                              status=status.HTTP_400_BAD_REQUEST)
            
            revision_reason = request.data.get('revision_reason', '')
            if revision_reason:
                FeedbackRevision.objects.create(
                    feedback=feedback,
                    revised_by=getattr(request, 'user', None) or feedback.observer,
                    revision_reason=revision_reason,
                    previous_data={
                        'strengths': feedback.strengths,
                        'areas_for_improvement': feedback.areas_for_improvement,
                        'overall_comments': feedback.overall_comments,
                        'action_step': feedback.action_step,
                        'action_step_category': feedback.action_step_category,
                    }
                )
            
            feedback.status = 'revised'
            feedback.save()
            
            serializer = self.get_serializer(feedback, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class FeedbackRevisionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = FeedbackRevision.objects.select_related('feedback', 'revised_by').all()
    serializer_class = FeedbackRevisionSerializer
    
    def get_queryset(self):
        queryset = FeedbackRevision.objects.select_related('feedback', 'revised_by')
        feedback_id = self.request.query_params.get('feedback')
        if feedback_id:
            queryset = queryset.filter(feedback_id=feedback_id)
        return queryset.order_by('-created_at')


class LessonPlanViewSet(viewsets.ModelViewSet):
    queryset = LessonPlan.objects.select_related('teacher__user', 'reviewer').all()
    serializer_class = LessonPlanSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by teacher
        teacher_id = self.request.query_params.get('teacher')
        if teacher_id:
            queryset = queryset.filter(teacher_id=teacher_id)
        
        # Filter by status
        status_param = self.request.query_params.get('status')
        if status_param:
            queryset = queryset.filter(status=status_param)
        
        # Filter by feedback status
        feedback_status = self.request.query_params.get('feedback_status')
        if feedback_status:
            queryset = queryset.filter(feedback_status=feedback_status)
        
        # Filter by due date range
        due_date_from = self.request.query_params.get('due_date_from')
        due_date_to = self.request.query_params.get('due_date_to')
        if due_date_from:
            queryset = queryset.filter(due_date__gte=due_date_from)
        if due_date_to:
            queryset = queryset.filter(due_date__lte=due_date_to)
        
        return queryset.order_by('-due_date', '-created_at')
    
    @action(detail=True, methods=['post'])
    def submit(self, request, pk=None):
        """Submit a lesson plan"""
        try:
            lesson_plan = self.get_object()
            
            if lesson_plan.status != 'pending':
                return Response({'error': 'Only pending lesson plans can be submitted'}, 
                              status=status.HTTP_400_BAD_REQUEST)
            
            # Check if document is uploaded
            if not lesson_plan.document:
                return Response({'error': 'Document must be uploaded before submission'}, 
                              status=status.HTTP_400_BAD_REQUEST)
            
            lesson_plan.status = 'submitted'
            lesson_plan.submit_date = timezone.now()
            lesson_plan.feedback_status = 'pending'
            lesson_plan.save()
            
            # TODO: Send notification to administrators/reviewers
            
            serializer = self.get_serializer(lesson_plan)
            return Response(serializer.data)
            
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=True, methods=['post'])
    def provide_feedback(self, request, pk=None):
        """Provide feedback on a lesson plan (for administrators)"""
        try:
            lesson_plan = self.get_object()
            
            if lesson_plan.status != 'submitted':
                return Response({'error': 'Only submitted lesson plans can receive feedback'}, 
                              status=status.HTTP_400_BAD_REQUEST)
            
            feedback_status = request.data.get('feedback_status')
            feedback_comment = request.data.get('feedback_comment', '')
            reviewer_id = request.data.get('reviewer')
            
            if not feedback_status:
                return Response({'error': 'Feedback status is required'}, 
                              status=status.HTTP_400_BAD_REQUEST)
            
            if feedback_status not in ['approved', 'needs_revision', 'pending']:
                return Response({'error': 'Invalid feedback status'}, 
                              status=status.HTTP_400_BAD_REQUEST)
            
            # Set reviewer
            if reviewer_id:
                try:
                    reviewer = Users.objects.get(id=reviewer_id)
                    lesson_plan.reviewer = reviewer
                except Users.DoesNotExist:
                    return Response({'error': f'Reviewer with id {reviewer_id} does not exist'}, 
                                  status=status.HTTP_400_BAD_REQUEST)
            
            lesson_plan.feedback_status = feedback_status
            lesson_plan.feedback_comment = feedback_comment
            lesson_plan.feedback_date = timezone.now()
            lesson_plan.save()
            
            # TODO: Send notification to teacher about feedback
            
            serializer = self.get_serializer(lesson_plan)
            return Response(serializer.data)
            
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=True, methods=['post'])
    def resubmit(self, request, pk=None):
        """Resubmit a lesson plan that needs revision"""
        try:
            lesson_plan = self.get_object()
            
            if lesson_plan.feedback_status != 'needs_revision':
                return Response({'error': 'Only lesson plans that need revision can be resubmitted'}, 
                              status=status.HTTP_400_BAD_REQUEST)
            
            # Update document if provided
            document = request.FILES.get('document')
            if document:
                lesson_plan.document = document
            
            # Update title and description if provided
            title = request.data.get('title')
            if title:
                lesson_plan.title = title
            
            description = request.data.get('description')
            if description is not None:  # Allow empty string
                lesson_plan.description = description
            
            lesson_plan.status = 'submitted'
            lesson_plan.submit_date = timezone.now()
            lesson_plan.feedback_status = 'pending'
            lesson_plan.feedback_comment = ''  # Clear previous feedback
            lesson_plan.feedback_date = None
            lesson_plan.save()
            
            # TODO: Send notification to administrators about resubmission
            
            serializer = self.get_serializer(lesson_plan)
            return Response(serializer.data)
            
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class LessonPlanFeedbackViewSet(viewsets.ModelViewSet):
    queryset = LessonPlanFeedback.objects.select_related('lesson_plan__teacher__user', 'reviewer').all()
    serializer_class = LessonPlanFeedbackSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by lesson plan
        lesson_plan_id = self.request.query_params.get('lesson_plan')
        if lesson_plan_id:
            queryset = queryset.filter(lesson_plan_id=lesson_plan_id)
        
        # Filter by reviewer
        reviewer_id = self.request.query_params.get('reviewer')
        if reviewer_id:
            queryset = queryset.filter(reviewer_id=reviewer_id)
        
        return queryset.order_by('-created_at')
    
    def create(self, request, *args, **kwargs):
        """Create detailed feedback for a lesson plan"""
        try:
            lesson_plan_id = request.data.get('lesson_plan')
            reviewer_id = request.data.get('reviewer')
            
            if not lesson_plan_id:
                return Response({'error': 'Lesson plan ID is required'}, 
                              status=status.HTTP_400_BAD_REQUEST)
            
            if not reviewer_id:
                return Response({'error': 'Reviewer ID is required'}, 
                              status=status.HTTP_400_BAD_REQUEST)
            
            # Check if lesson plan exists and is submitted
            try:
                lesson_plan = LessonPlan.objects.get(id=lesson_plan_id)
                if lesson_plan.status != 'submitted':
                    return Response({'error': 'Only submitted lesson plans can receive detailed feedback'}, 
                                  status=status.HTTP_400_BAD_REQUEST)
            except LessonPlan.DoesNotExist:
                return Response({'error': f'Lesson plan with id {lesson_plan_id} does not exist'}, 
                              status=status.HTTP_400_BAD_REQUEST)
            
            # Check if reviewer exists
            try:
                reviewer = Users.objects.get(id=reviewer_id)
            except Users.DoesNotExist:
                return Response({'error': f'Reviewer with id {reviewer_id} does not exist'}, 
                              status=status.HTTP_400_BAD_REQUEST)
            
            # Check if detailed feedback already exists
            if hasattr(lesson_plan, 'detailed_feedback'):
                return Response({'error': 'Detailed feedback already exists for this lesson plan'}, 
                              status=status.HTTP_400_BAD_REQUEST)
            
            return super().create(request, *args, **kwargs)
            
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

