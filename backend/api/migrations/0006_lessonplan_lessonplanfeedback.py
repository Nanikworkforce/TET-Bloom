# Generated migration for lesson plan models

from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0005_administrator_bio_administrator_department_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='LessonPlan',
            fields=[
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('title', models.CharField(help_text='e.g., Week of March 6-10, 2023', max_length=255)),
                ('description', models.TextField(blank=True, help_text="Brief description of the week's focus", null=True)),
                ('due_date', models.DateField(help_text='Date when the lesson plan is due')),
                ('submit_date', models.DateTimeField(blank=True, help_text='When the plan was submitted', null=True)),
                ('status', models.CharField(choices=[('pending', 'Pending'), ('submitted', 'Submitted'), ('overdue', 'Overdue')], default='pending', max_length=20)),
                ('document', models.FileField(blank=True, help_text='Lesson plan document (.pdf, .doc, .docx)', null=True, upload_to='lesson_plans/')),
                ('feedback_status', models.CharField(blank=True, choices=[('approved', 'Approved'), ('needs_revision', 'Needs Revision'), ('pending', 'Under Review')], max_length=20, null=True)),
                ('feedback_comment', models.TextField(blank=True, null=True)),
                ('feedback_date', models.DateTimeField(blank=True, null=True)),
                ('reviewer', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='reviewed_lesson_plans', to='api.users')),
                ('teacher', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='lesson_plans', to='api.teacher')),
            ],
            options={
                'verbose_name': 'Lesson Plan',
                'verbose_name_plural': 'Lesson Plans',
                'ordering': ['-due_date', '-created_at'],
            },
        ),
        migrations.CreateModel(
            name='LessonPlanFeedback',
            fields=[
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('clarity_rating', models.IntegerField(blank=True, choices=[(1, 'Needs Significant Improvement'), (2, 'Needs Improvement'), (3, 'Satisfactory'), (4, 'Good'), (5, 'Excellent')], help_text='Clarity of objectives and activities', null=True)),
                ('alignment_rating', models.IntegerField(blank=True, choices=[(1, 'Needs Significant Improvement'), (2, 'Needs Improvement'), (3, 'Satisfactory'), (4, 'Good'), (5, 'Excellent')], help_text='Alignment with curriculum standards', null=True)),
                ('engagement_rating', models.IntegerField(blank=True, choices=[(1, 'Needs Significant Improvement'), (2, 'Needs Improvement'), (3, 'Satisfactory'), (4, 'Good'), (5, 'Excellent')], help_text='Student engagement strategies', null=True)),
                ('assessment_rating', models.IntegerField(blank=True, choices=[(1, 'Needs Significant Improvement'), (2, 'Needs Improvement'), (3, 'Satisfactory'), (4, 'Good'), (5, 'Excellent')], help_text='Assessment methods and rubrics', null=True)),
                ('differentiation_rating', models.IntegerField(blank=True, choices=[(1, 'Needs Significant Improvement'), (2, 'Needs Improvement'), (3, 'Satisfactory'), (4, 'Good'), (5, 'Excellent')], help_text='Differentiation for diverse learners', null=True)),
                ('strengths', models.TextField(blank=True, help_text='What worked well in this lesson plan', null=True)),
                ('areas_for_improvement', models.TextField(blank=True, help_text='Areas that need improvement', null=True)),
                ('specific_suggestions', models.TextField(blank=True, help_text='Specific suggestions for improvement', null=True)),
                ('overall_comments', models.TextField(blank=True, help_text='Overall feedback comments', null=True)),
                ('lesson_plan', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='detailed_feedback', to='api.lessonplan')),
                ('reviewer', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='lesson_plan_feedback', to='api.users')),
            ],
            options={
                'verbose_name': 'Lesson Plan Feedback',
                'verbose_name_plural': 'Lesson Plan Feedback',
            },
        ),
    ]