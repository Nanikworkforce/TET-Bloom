from django.core.mail import send_mail
from django.conf import settings
from .models.user import Users
import random
import string

def send_email(user: Users, password: str):
    subject = 'Welcome to the System'
    message = f"""
    Hello {user.name},

    Your account has been created.

    Email: {user.email}
    Temporary Password: {password}

    Please log in and change your password immediately.
    """
    send_mail(
        subject,
        message,
        settings.DEFAULT_FROM_EMAIL,
        [user.email],
        fail_silently=False,
    )


def generate_password(length=12):
    return ''.join(random.choices(string.ascii_letters + string.digits, k=length))


