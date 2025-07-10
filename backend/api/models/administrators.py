from backend.basemodel import TimeBaseModel
from django.db import models

class Administrator(TimeBaseModel):
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Administrator'
        verbose_name_plural = 'Administrators'

