"""
Email notification service for T-TESS Bloom application
"""
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.conf import settings
from django.utils.html import strip_tags
from typing import Dict, List, Optional
import logging

logger = logging.getLogger(__name__)

class NotificationService:
    
    @staticmethod
    def send_observation_scheduled_notification(
        teacher_email: str,
        teacher_name: str,
        observation_data: Dict,
        observer_name: str = None
    ) -> bool:
        """
        Send email notification when an observation is scheduled
        
        Args:
            teacher_email: Teacher's email address
            teacher_name: Teacher's full name
            observation_data: Dictionary containing observation details
            observer_name: Name of the observer/administrator
            
        Returns:
            bool: True if email sent successfully, False otherwise
        """
        try:
            # Get notification settings
            notification_config = settings.NOTIFICATION_SETTINGS.get('OBSERVATION_SCHEDULED', {})
            
            if not notification_config.get('enabled', False):
                logger.info("Observation scheduled notifications are disabled")
                return False
            
            # Prepare email context
            context = {
                'teacher_name': teacher_name,
                'observer_name': observer_name or 'Administrator',
                'observation_date': observation_data.get('date'),
                'observation_time': observation_data.get('time'),
                'observation_type': observation_data.get('observation_type', '').replace('_', ' ').title(),
                'subject': observation_data.get('subject', ''),
                'grade': observation_data.get('grade', ''),
                'notes': observation_data.get('notes', ''),
                'site_url': getattr(settings, 'SITE_URL', 'https://tet-bloom-git-main-nanikworkforces-projects.vercel.app'),
            }
            
            # Create email content
            subject = notification_config.get('subject', 'New Observation Scheduled')
            
            # HTML email content
            html_message = f"""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>{subject}</title>
                <style>
                    body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                    .header {{ background: linear-gradient(90deg, rgba(132, 84, 124, 1) 0%, rgba(228, 164, 20, 1) 100%); color: white; padding: 20px; text-align: center; }}
                    .content {{ padding: 20px; background-color: #f9f9f9; }}
                    .details {{ background: white; padding: 15px; border-radius: 8px; margin: 15px 0; }}
                    .detail-row {{ display: flex; justify-content: space-between; margin: 8px 0; border-bottom: 1px solid #eee; padding-bottom: 8px; }}
                    .label {{ font-weight: bold; color: #84547c; }}
                    .footer {{ text-align: center; padding: 20px; color: #666; font-size: 12px; }}
                    .button {{ display: inline-block; background: linear-gradient(90deg, rgba(132, 84, 124, 1) 0%, rgba(228, 164, 20, 1) 100%); color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 15px 0; }}
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>📅 New Observation Scheduled</h1>
                    <p>T-TESS Bloom Evaluation System</p>
                </div>
                
                <div class="content">
                    <h2>Hello {teacher_name},</h2>
                    <p>A new observation has been scheduled for you. Please review the details below:</p>
                    
                    <div class="details">
                        <h3>📋 Observation Details</h3>
                        <div class="detail-row">
                            <span class="label">Date:</span>
                            <span>{context['observation_date']}</span>
                        </div>
                        <div class="detail-row">
                            <span class="label">Time:</span>
                            <span>{context['observation_time']}</span>
                        </div>
                        <div class="detail-row">
                            <span class="label">Type:</span>
                            <span>{context['observation_type']}</span>
                        </div>
                        <div class="detail-row">
                            <span class="label">Subject:</span>
                            <span>{context['subject']}</span>
                        </div>
                        <div class="detail-row">
                            <span class="label">Grade Level:</span>
                            <span>{context['grade']}</span>
                        </div>
                        <div class="detail-row">
                            <span class="label">Observer:</span>
                            <span>{context['observer_name']}</span>
                        </div>
            """
            
            if context['notes']:
                html_message += f"""
                        <div class="detail-row">
                            <span class="label">Notes:</span>
                            <span>{context['notes']}</span>
                        </div>
                """
            
            html_message += f"""
                    </div>
                    
                    <div style="text-align: center;">
                        <a href="{context['site_url']}/teacher/observations" class="button">
                            View Your Observations
                        </a>
                    </div>
                    
                    <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 6px; padding: 15px; margin: 20px 0;">
                        <h4 style="color: #856404; margin: 0 0 10px 0;">📝 Preparation Reminders:</h4>
                        <ul style="margin: 0; padding-left: 20px; color: #856404;">
                            <li>Review your lesson plan and ensure it aligns with learning objectives</li>
                            <li>Prepare any materials or technology needed for the lesson</li>
                            <li>Consider having student work samples ready if applicable</li>
                            <li>Review the T-TESS rubric if this is a formal observation</li>
                        </ul>
                    </div>
                </div>
                
                <div class="footer">
                    <p>This is an automated notification from T-TESS Bloom.</p>
                    <p>If you have any questions, please contact your administrator.</p>
                </div>
            </body>
            </html>
            """
            
            # Plain text version
            plain_message = f"""
Hello {teacher_name},

A new observation has been scheduled for you. Please review the details below:

OBSERVATION DETAILS:
Date: {context['observation_date']}
Time: {context['observation_time']}
Type: {context['observation_type']}
Subject: {context['subject']}
Grade Level: {context['grade']}
Observer: {context['observer_name']}
            """
            
            if context['notes']:
                plain_message += f"Notes: {context['notes']}\n"
            
            plain_message += f"""

View your observations: {context['site_url']}/teacher/observations

PREPARATION REMINDERS:
- Review your lesson plan and ensure it aligns with learning objectives
- Prepare any materials or technology needed for the lesson
- Consider having student work samples ready if applicable
- Review the T-TESS rubric if this is a formal observation

This is an automated notification from T-TESS Bloom.
If you have any questions, please contact your administrator.
            """
            
            # Send email
            send_mail(
                subject=subject,
                message=plain_message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[teacher_email],
                html_message=html_message,
                fail_silently=False,
            )
            
            logger.info(f"Observation scheduled notification sent to {teacher_email}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to send observation notification to {teacher_email}: {str(e)}")
            return False
    
    @staticmethod
    def send_observation_reminder_notification(
        teacher_email: str,
        teacher_name: str,
        observation_data: Dict,
        observer_name: str = None,
        days_until_observation: int = 1
    ) -> bool:
        """
        Send reminder email notification for upcoming observation
        
        Args:
            teacher_email: Teacher's email address
            teacher_name: Teacher's full name
            observation_data: Dictionary containing observation details
            observer_name: Name of the observer/administrator
            days_until_observation: Number of days until the observation
            
        Returns:
            bool: True if email sent successfully, False otherwise
        """
        try:
            # Get notification settings
            notification_config = settings.NOTIFICATION_SETTINGS.get('OBSERVATION_REMINDER', {})
            
            if not notification_config.get('enabled', False):
                logger.info("Observation reminder notifications are disabled")
                return False
            
            # Prepare email context
            context = {
                'teacher_name': teacher_name,
                'observer_name': observer_name or 'Administrator',
                'observation_date': observation_data.get('date'),
                'observation_time': observation_data.get('time'),
                'observation_type': observation_data.get('observation_type', '').replace('_', ' ').title(),
                'subject': observation_data.get('subject', ''),
                'grade': observation_data.get('grade', ''),
                'days_until': days_until_observation,
                'site_url': getattr(settings, 'SITE_URL', 'https://tet-bloom-git-main-nanikworkforces-projects.vercel.app'),
            }
            
            # Create subject based on timing
            if days_until_observation == 0:
                subject = 'Observation Today - T-TESS Bloom'
                timing_text = 'today'
            elif days_until_observation == 1:
                subject = 'Observation Tomorrow - T-TESS Bloom'
                timing_text = 'tomorrow'
            else:
                subject = f'Observation in {days_until_observation} Days - T-TESS Bloom'
                timing_text = f'in {days_until_observation} days'
            
            # HTML email content
            html_message = f"""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>{subject}</title>
                <style>
                    body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                    .header {{ background: linear-gradient(90deg, rgba(132, 84, 124, 1) 0%, rgba(228, 164, 20, 1) 100%); color: white; padding: 20px; text-align: center; }}
                    .content {{ padding: 20px; background-color: #f9f9f9; }}
                    .details {{ background: white; padding: 15px; border-radius: 8px; margin: 15px 0; }}
                    .reminder-box {{ background: #e8f4fd; border-left: 4px solid #84547c; padding: 15px; margin: 20px 0; }}
                    .footer {{ text-align: center; padding: 20px; color: #666; font-size: 12px; }}
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>⏰ Observation Reminder</h1>
                    <p>Your observation is scheduled {timing_text}</p>
                </div>
                
                <div class="content">
                    <h2>Hello {teacher_name},</h2>
                    <p>This is a friendly reminder that your observation is scheduled {timing_text}.</p>
                    
                    <div class="details">
                        <h3>📋 Observation Details</h3>
                        <p><strong>Date:</strong> {context['observation_date']}</p>
                        <p><strong>Time:</strong> {context['observation_time']}</p>
                        <p><strong>Type:</strong> {context['observation_type']}</p>
                        <p><strong>Subject:</strong> {context['subject']}</p>
                        <p><strong>Grade:</strong> {context['grade']}</p>
                        <p><strong>Observer:</strong> {context['observer_name']}</p>
                    </div>
                    
                    <div class="reminder-box">
                        <h4>✅ Final Preparation Checklist:</h4>
                        <ul>
                            <li>Lesson plan reviewed and materials prepared</li>
                            <li>Learning objectives clearly defined</li>
                            <li>Technology tested and ready (if applicable)</li>
                            <li>Student work samples organized</li>
                            <li>Classroom environment optimized</li>
                        </ul>
                    </div>
                </div>
                
                <div class="footer">
                    <p>Best of luck with your observation!</p>
                    <p>T-TESS Bloom Evaluation System</p>
                </div>
            </body>
            </html>
            """
            
            # Plain text version
            plain_message = f"""
Hello {teacher_name},

This is a friendly reminder that your observation is scheduled {timing_text}.

OBSERVATION DETAILS:
Date: {context['observation_date']}
Time: {context['observation_time']}
Type: {context['observation_type']}
Subject: {context['subject']}
Grade: {context['grade']}
Observer: {context['observer_name']}

FINAL PREPARATION CHECKLIST:
- Lesson plan reviewed and materials prepared
- Learning objectives clearly defined
- Technology tested and ready (if applicable)
- Student work samples organized
- Classroom environment optimized

Best of luck with your observation!
T-TESS Bloom Evaluation System
            """
            
            # Send email
            send_mail(
                subject=subject,
                message=plain_message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[teacher_email],
                html_message=html_message,
                fail_silently=False,
            )
            
            logger.info(f"Observation reminder notification sent to {teacher_email}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to send observation reminder to {teacher_email}: {str(e)}")
            return False

    @staticmethod
    def send_bulk_notifications(notifications: List[Dict]) -> Dict[str, int]:
        """
        Send multiple notifications in bulk
        
        Args:
            notifications: List of notification dictionaries
            
        Returns:
            Dict with success and failure counts
        """
        results = {'success': 0, 'failed': 0}
        
        for notification in notifications:
            notification_type = notification.get('type')
            success = False
            
            if notification_type == 'observation_scheduled':
                success = NotificationService.send_observation_scheduled_notification(
                    teacher_email=notification['teacher_email'],
                    teacher_name=notification['teacher_name'],
                    observation_data=notification['observation_data'],
                    observer_name=notification.get('observer_name')
                )
            elif notification_type == 'observation_reminder':
                success = NotificationService.send_observation_reminder_notification(
                    teacher_email=notification['teacher_email'],
                    teacher_name=notification['teacher_name'],
                    observation_data=notification['observation_data'],
                    observer_name=notification.get('observer_name'),
                    days_until_observation=notification.get('days_until_observation', 1)
                )
            
            if success:
                results['success'] += 1
            else:
                results['failed'] += 1
                
        return results
