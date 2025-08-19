from backend.basemodel import TimeBaseModel
from django.db import models
from .schedule import Schedule
from .teachers import Teacher
from .user import Users
import uuid
import json

class Feedback(TimeBaseModel):
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('submitted', 'Submitted'),
        ('approved', 'Approved by Teacher'),
        ('review_requested', 'Review Requested'),
        ('revised', 'Revised'),
    ]
    
    OVERALL_RATING_CHOICES = [
        ('excellent', 'Excellent'),
        ('good', 'Good'),
        ('satisfactory', 'Satisfactory'),
        ('needs_improvement', 'Needs Improvement'),
    ]

    ACTION_CATEGORY_CHOICES = [
        ('internalization', 'Internalization'),
        ('year_long_pacing', 'Year-Long Pacing'),
        ('lesson_pacing', 'Lesson Pacing'),
        ('student_engagement', 'Student Engagement'),
        ('instructional_methods', 'Instructional Methods'),
        ('assessment', 'Assessment'),
        ('classroom_management', 'Classroom Management'),
        ('content_knowledge', 'Content Knowledge'),
        ('professional_development', 'Professional Development'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Relationships
    schedule = models.OneToOneField(Schedule, on_delete=models.CASCADE, related_name='feedback')
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE, related_name='received_feedback')
    observer = models.ForeignKey(Users, on_delete=models.CASCADE, related_name='provided_feedback')
    
    # Status and metadata
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    
    # Performance scores (1-5 scale)
    score_classroom_management = models.IntegerField(default=3, help_text="Classroom management score (1-5)")
    score_content_knowledge = models.IntegerField(default=3, help_text="Content knowledge score (1-5)")
    score_student_engagement = models.IntegerField(default=3, help_text="Student engagement score (1-5)")
    score_teaching_methods = models.IntegerField(default=3, help_text="Teaching methods score (1-5)")
    score_assessment = models.IntegerField(default=3, help_text="Assessment score (1-5)")
    score_professionalism = models.IntegerField(default=3, help_text="Professionalism score (1-5)")
    
    # Qualitative feedback (stored as JSON arrays)
    strengths = models.JSONField(default=list, help_text="List of observed strengths")
    areas_for_improvement = models.JSONField(default=list, help_text="List of areas for improvement")
    
    # Comments and context
    overall_comments = models.TextField(blank=True, help_text="General observations and feedback")
    lesson_objectives = models.TextField(blank=True, help_text="Lesson objectives observed")
    observation_notes = models.TextField(blank=True, help_text="Additional observation notes")
    
    # Action plan
    action_step_category = models.CharField(max_length=50, choices=ACTION_CATEGORY_CHOICES, blank=True)
    action_step = models.TextField(blank=True, help_text="Specific recommended action step")
    
    # Overall rating (calculated from scores)
    overall_rating = models.CharField(max_length=20, choices=OVERALL_RATING_CHOICES, blank=True)
    
    # Teacher response fields
    teacher_response_date = models.DateTimeField(null=True, blank=True)
    teacher_response_comments = models.TextField(blank=True, help_text="Teacher's response or review request")
    
    # Revision tracking
    revision_history = models.JSONField(default=list, help_text="History of revisions")
    
    def calculate_overall_rating(self):
        """Calculate overall rating based on average scores"""
        scores = [
            self.score_classroom_management,
            self.score_content_knowledge,
            self.score_student_engagement,
            self.score_teaching_methods,
            self.score_assessment,
            self.score_professionalism
        ]
        average = sum(scores) / len(scores)
        
        if average >= 4.5:
            return 'excellent'
        elif average >= 3.5:
            return 'good'
        elif average >= 2.5:
            return 'satisfactory'
        else:
            return 'needs_improvement'
    
    def save(self, *args, **kwargs):
        # Auto-calculate overall rating
        self.overall_rating = self.calculate_overall_rating()
        super().save(*args, **kwargs)
    
    @property
    def average_score(self):
        """Get the average of all scores"""
        scores = [
            self.score_classroom_management,
            self.score_content_knowledge,
            self.score_student_engagement,
            self.score_teaching_methods,
            self.score_assessment,
            self.score_professionalism
        ]
        return round(sum(scores) / len(scores), 2)
    
    def __str__(self):
        return f"Feedback for {self.teacher.user.name} - {self.schedule.date} ({self.status})"

    class Meta:
        verbose_name = 'Feedback'
        verbose_name_plural = 'Feedback'
        ordering = ['-created_at']


class FeedbackRevision(TimeBaseModel):
    """Track revisions to feedback"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    feedback = models.ForeignKey(Feedback, on_delete=models.CASCADE, related_name='revisions')
    revised_by = models.ForeignKey(Users, on_delete=models.CASCADE)
    revision_reason = models.TextField(help_text="Reason for the revision")
    
    # Store the previous values
    previous_data = models.JSONField(help_text="Previous feedback data before revision")
    
    def __str__(self):
        return f"Revision for {self.feedback} by {self.revised_by.name}"

    class Meta:
        verbose_name = 'Feedback Revision'
        verbose_name_plural = 'Feedback Revisions'
        ordering = ['-created_at']
