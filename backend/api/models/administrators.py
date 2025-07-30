from backend.basemodel import TimeBaseModel
from django.db import models
from .user import Users

class Administrator(TimeBaseModel):
    user = models.OneToOneField(Users, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.user.name} - Administrator"

    class Meta:
        verbose_name = 'Administrator'
        verbose_name_plural = 'Administrators'

