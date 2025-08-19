from django.contrib import admin
from .models.teachers import Teacher
from .models.observation_groups import ObservationGroup
from .models.schedule import Schedule
from .models.administrators import Administrator
from .models.user import Users
from .models.feedback import Feedback, FeedbackRevision
# Register your models here.

@admin.register(Teacher)
class TeacherAdmin(admin.ModelAdmin):
    list_display = ('subject', 'grade', 'user', 'years_of_experience')

@admin.register(ObservationGroup)
class ObservationGroupAdmin(admin.ModelAdmin):
    list_display = ('name', 'note', 'get_teacher_count', 'status')
    
    def get_teacher_count(self, obj):
        return obj.teachers.count()
    get_teacher_count.short_description = 'Teachers'

@admin.register(Schedule)
class ScheduleAdmin(admin.ModelAdmin):
    list_display = ('observation_group', 'date', 'time', 'status')

@admin.register(Administrator)
class AdministratorAdmin(admin.ModelAdmin):
    list_display = ('user',)

@admin.register(Users)
class UsersAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'role')

@admin.register(Feedback)
class FeedbackAdmin(admin.ModelAdmin):
    list_display = ('teacher', 'observer', 'status', 'overall_rating', 'average_score', 'created_at')
    list_filter = ('status', 'overall_rating', 'created_at')
    search_fields = ('teacher__user__name', 'observer__name')
    readonly_fields = ('average_score', 'overall_rating')
    
    fieldsets = (
        ('Basic Info', {
            'fields': ('schedule', 'teacher', 'observer', 'status')
        }),
        ('Scores', {
            'fields': (
                'score_classroom_management', 'score_content_knowledge',
                'score_student_engagement', 'score_teaching_methods',
                'score_assessment', 'score_professionalism', 
                'average_score', 'overall_rating'
            )
        }),
        ('Feedback', {
            'fields': ('strengths', 'areas_for_improvement', 'overall_comments')
        }),
        ('Action Plan', {
            'fields': ('action_step_category', 'action_step')
        }),
        ('Context', {
            'fields': ('lesson_objectives', 'observation_notes')
        }),
        ('Teacher Response', {
            'fields': ('teacher_response_date', 'teacher_response_comments')
        })
    )

@admin.register(FeedbackRevision)
class FeedbackRevisionAdmin(admin.ModelAdmin):
    list_display = ('feedback', 'revised_by', 'revision_reason', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('feedback__teacher__user__name', 'revised_by__name', 'revision_reason')
    readonly_fields = ('created_at',)
