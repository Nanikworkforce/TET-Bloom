from backend.basemodel import TimeBaseModel
from django.db import models
import uuid

class Users(TimeBaseModel):

    ROLE_CHOICES = [
        ('Administrator', 'Administrator'),
        ('Teacher', 'Teacher'),
        ('Super User', 'Super User'),
    ]
    USER_STATUS_CHOICES = [
        ('Active', 'Active'),
        ('Inactive', 'Inactive'),
    ]

    id= models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name=models.CharField(max_length=255)
    email=models.EmailField(unique=True)
    role=models.CharField(max_length=255,choices=ROLE_CHOICES)
    status=models.CharField(max_length=255,choices=USER_STATUS_CHOICES,default='Active')
    def __str__(self):
        return self.name