#!/usr/bin/env python
import os
import sys
import django

# Add the backend directory to the path and setup Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from api.models.user import Users
from api.models.administrators import Administrator

def create_admin_record():
    email = input('Enter the email of your invited user: ')
    try:
        user_record = Users.objects.get(email=email)
        admin_record, created = Administrator.objects.get_or_create(user=user_record)
        if created:
            print(f'✅ Created administrator record for {email}')
        else:
            print(f'ℹ️  Administrator record already exists for {email}')
    except Users.DoesNotExist:
        print(f'❌ No user found with email {email}')
        print('Available users:')
        for user in Users.objects.all():
            print(f'  - {user.email} (role: {user.role})')

if __name__ == '__main__':
    create_admin_record()
