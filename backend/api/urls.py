from django.urls import path, include
from .views import *
from rest_framework import routers

router = routers.DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'teachers', TeacherViewSet)
router.register(r'observation-groups', ObservationGroupViewSet)
router.register(r'schedules', ScheduleViewSet)
router.register(r'administrators', AdministratorViewSet)

urlpatterns = [
    # path('', index, name='index'),
    path('total-stats/', TotalStats, name='total-stats'),
    path('', include(router.urls)),
]
