from backend.basemodel import TimeBaseModel
from django.db import models
from .observation_groups import ObservationGroup
from .teachers import Teacher
import uuid

class Schedule(TimeBaseModel):
    STATUS_CHOICES = [
        ('Scheduled', 'Scheduled'),
        ('Completed', 'Completed'),
        ('Cancelled', 'Cancelled'),
    ]
    
    OBSERVATION_TYPE_CHOICES = [
        ('formal', 'Formal Observation'),
        ('walk-through', 'Walk-through'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    observation_group = models.ForeignKey(ObservationGroup, on_delete=models.CASCADE, null=True, blank=True, related_name='schedules')
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE, null=True, blank=True, related_name='schedules')
    date = models.DateField()
    time = models.TimeField()
    observation_type = models.CharField(max_length=20, choices=OBSERVATION_TYPE_CHOICES, default='formal')
    notes = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=255, choices=STATUS_CHOICES, default='Scheduled')

    def __str__(self):
        if self.observation_group:
            return f"{self.observation_group.name} - {self.date}"
        elif self.teacher:
            return f"{self.teacher.user.name} - {self.date}"
        return f"Schedule - {self.date}"

    class Meta:
        verbose_name = 'Schedule'
        verbose_name_plural = 'Schedules'

