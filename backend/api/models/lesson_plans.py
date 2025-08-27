from backend.basemodel import TimeBaseModel
from django.db import models
from django.core.files.storage import default_storage
from .teachers import Teacher
from .user import Users
import uuid
import os


class LessonPlan(TimeBaseModel):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('submitted', 'Submitted'),
        ('overdue', 'Overdue'),
    ]
    
    FEEDBACK_STATUS_CHOICES = [
        ('approved', 'Approved'),
        ('needs_revision', 'Needs Revision'),
        ('pending', 'Under Review'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Relationships
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE, related_name='lesson_plans')
    reviewer = models.ForeignKey(Users, on_delete=models.SET_NULL, null=True, blank=True, related_name='reviewed_lesson_plans')
    
    # Plan Information
    title = models.CharField(max_length=255, help_text="e.g., Week of March 6-10, 2023")
    description = models.TextField(blank=True, null=True, help_text="Brief description of the week's focus")
    
    # Dates
    due_date = models.DateField(help_text="Date when the lesson plan is due")
    submit_date = models.DateTimeField(null=True, blank=True, help_text="When the plan was submitted")
    
    # Status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    # File upload
    document = models.FileField(
        upload_to='lesson_plans/', 
        null=True, 
        blank=True,
        help_text="Lesson plan document (.pdf, .doc, .docx)"
    )
    
    # Feedback
    feedback_status = models.CharField(
        max_length=20, 
        choices=FEEDBACK_STATUS_CHOICES, 
        null=True, 
        blank=True
    )
    feedback_comment = models.TextField(blank=True, null=True)
    feedback_date = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.teacher.user.name} - {self.title}"

    @property
    def subject(self):
        return self.teacher.subject
    
    @property
    def grade(self):
        return self.teacher.grade
    
    @property
    def teacher_name(self):
        return self.teacher.user.name
    
    @property
    def reviewer_name(self):
        return self.reviewer.name if self.reviewer else None
    
    def get_document_url(self):
        """Get the URL for the uploaded document"""
        if self.document:
            return default_storage.url(self.document.name)
        return None
    
    def get_document_size(self):
        """Get the size of the uploaded document in bytes"""
        if self.document:
            try:
                return self.document.size
            except:
                return 0
        return 0
    
    def get_document_extension(self):
        """Get the file extension of the uploaded document"""
        if self.document:
            return os.path.splitext(self.document.name)[1].lower()
        return None

    class Meta:
        verbose_name = 'Lesson Plan'
        verbose_name_plural = 'Lesson Plans'
        ordering = ['-due_date', '-created_at']


class LessonPlanFeedback(TimeBaseModel):
    """Separate model for detailed feedback on lesson plans"""
    
    RATING_CHOICES = [
        (1, 'Needs Significant Improvement'),
        (2, 'Needs Improvement'),
        (3, 'Satisfactory'),
        (4, 'Good'),
        (5, 'Excellent'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Relationships
    lesson_plan = models.OneToOneField(LessonPlan, on_delete=models.CASCADE, related_name='detailed_feedback')
    reviewer = models.ForeignKey(Users, on_delete=models.CASCADE, related_name='lesson_plan_feedback')
    
    # Ratings (optional detailed feedback)
    clarity_rating = models.IntegerField(choices=RATING_CHOICES, null=True, blank=True, help_text="Clarity of objectives and activities")
    alignment_rating = models.IntegerField(choices=RATING_CHOICES, null=True, blank=True, help_text="Alignment with curriculum standards")
    engagement_rating = models.IntegerField(choices=RATING_CHOICES, null=True, blank=True, help_text="Student engagement strategies")
    assessment_rating = models.IntegerField(choices=RATING_CHOICES, null=True, blank=True, help_text="Assessment methods and rubrics")
    differentiation_rating = models.IntegerField(choices=RATING_CHOICES, null=True, blank=True, help_text="Differentiation for diverse learners")
    
    # Comments
    strengths = models.TextField(blank=True, null=True, help_text="What worked well in this lesson plan")
    areas_for_improvement = models.TextField(blank=True, null=True, help_text="Areas that need improvement")
    specific_suggestions = models.TextField(blank=True, null=True, help_text="Specific suggestions for improvement")
    overall_comments = models.TextField(blank=True, null=True, help_text="Overall feedback comments")
    
    def __str__(self):
        return f"Feedback for {self.lesson_plan.title} by {self.reviewer.name}"

    @property
    def average_rating(self):
        """Calculate average rating across all categories"""
        ratings = [
            self.clarity_rating,
            self.alignment_rating,
            self.engagement_rating,
            self.assessment_rating,
            self.differentiation_rating
        ]
        valid_ratings = [r for r in ratings if r is not None]
        if valid_ratings:
            return sum(valid_ratings) / len(valid_ratings)
        return None

    class Meta:
        verbose_name = 'Lesson Plan Feedback'
        verbose_name_plural = 'Lesson Plan Feedback'
