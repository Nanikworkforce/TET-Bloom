from backend.basemodel import TimeBaseModel
from django.db import models
from .teachers import Teacher
from .user import Users
import uuid


class ObservationGroup(TimeBaseModel):
    STATUS_CHOICES = [
        ('Scheduled', 'Scheduled'),
        ('Completed', 'Completed'),
        ('Cancelled', 'Cancelled'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    note = models.TextField(blank=True, null=True)
    created_by = models.ForeignKey(Users, on_delete=models.CASCADE, related_name='created_groups')
    teachers = models.ManyToManyField(Teacher, related_name='observation_groups')
    status = models.CharField(max_length=255, choices=STATUS_CHOICES, default='Scheduled')

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Observation Group'
        verbose_name_plural = 'Observation Groups'
