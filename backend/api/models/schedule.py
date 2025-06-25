from backend.basemodel import TimeBaseModel
from django.db import models
from .observation_groups import ObservationGroup
import uuid

class Schedule(TimeBaseModel):
    STATUS_CHOICES = [
        ('Active', 'Active'),
        ('Inactive', 'Inactive'),
    ]

    id= models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    observation_group=models.ForeignKey(ObservationGroup,on_delete=models.CASCADE)
    date=models.DateField()
    time=models.TimeField()
    status=models.CharField(max_length=255,choices=STATUS_CHOICES,default='Active')

    def __str__(self):
        return self.observation_group.name

    class Meta:
        verbose_name = 'Schedule'
        verbose_name_plural = 'Schedules'

