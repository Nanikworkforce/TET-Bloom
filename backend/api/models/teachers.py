from backend.basemodel import TimeBaseModel
from django.db import models
from .user import Users

class Teacher(TimeBaseModel):
    grade_level_choices = [
        ('Kindergarten', 'Kindergarten'),
        ('1st Grade', '1st Grade'),
        ('2nd Grade', '2nd Grade'),
        ('3rd Grade', '3rd Grade'),
        ('4th Grade', '4th Grade'),
        ('5th Grade', '5th Grade'),
        ('6th Grade', '6th Grade'),
        ('7th Grade', '7th Grade'),
        ('8th Grade', '8th Grade'),
        ('9th Grade', '9th Grade'),
        ('10th Grade', '10th Grade'),
        ('11th Grade', '11th Grade'),
        ('12th Grade', '12th Grade'),
        ('Specialist/Other', 'Specialist/Other'),
    ]
    user=models.OneToOneField(Users,on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    subject=models.CharField(max_length=255)
    grade=models.CharField(max_length=255,choices=grade_level_choices,default='--Select Grade Level--')
    years_of_experience=models.IntegerField()


    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Teacher'
        verbose_name_plural = 'Teachers'


