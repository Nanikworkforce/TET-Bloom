from django.contrib import admin
from .models.teachers import Teacher
from .models.observation_groups import ObservationGroup
from .models.schedule import Schedule
from .models.administrators import Administrator
from .models.user import Users
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




