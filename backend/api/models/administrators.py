from backend.basemodel import TimeBaseModel
from django.db import models
from .user import Users

class Administrator(TimeBaseModel):
    user = models.OneToOneField(Users, on_delete=models.CASCADE)
    department = models.CharField(max_length=200, blank=True, null=True)
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    office_location = models.CharField(max_length=200, blank=True, null=True)
    bio = models.TextField(blank=True, null=True)
    join_date = models.DateField(blank=True, null=True)

    def __str__(self):
        return f"{self.user.name} - Administrator"

    class Meta:
        verbose_name = 'Administrator'
        verbose_name_plural = 'Administrators'

