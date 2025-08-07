from django.core.mail import send_mail
from django.conf import settings
from .models.user import Users
import random
import string
import httpx

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


def create_supabase_user(email: str, password: str, name: str, role: str):
    """Create user in Supabase using admin API"""
    try:
        # Use the same Supabase URL from your frontend
        supabase_url = "https://csgdjckpnonkwwctugtj.supabase.co"
        # Get service role key from environment or settings
        supabase_service_key = settings.SUPABASE_SERVICE_ROLE_KEY
        
        # For testing: If no service key, just skip Supabase creation (user won't be able to login)
        if not supabase_service_key:
            print("⚠️  SUPABASE_SERVICE_ROLE_KEY not configured - new users won't be able to login via frontend")
            print("   Set SUPABASE_SERVICE_ROLE_KEY in backend/.env file")
            return False
        
        if not supabase_service_key or supabase_service_key == "YOUR_SERVICE_ROLE_KEY_HERE":
            print("Warning: SUPABASE_SERVICE_ROLE_KEY not set, skipping Supabase user creation")
            return False
        
        # Create user in Supabase Auth
        auth_url = f"{supabase_url}/auth/v1/admin/users"
        auth_headers = {
            "Authorization": f"Bearer {supabase_service_key}",
            "Content-Type": "application/json"
        }
        auth_data = {
            "email": email,
            "password": password,
            "email_confirm": True,
            "user_metadata": {
                "name": name,
                "role": role
            }
        }
        
        with httpx.Client() as client:
            auth_response = client.post(auth_url, json=auth_data, headers=auth_headers)
            auth_response.raise_for_status()
            user_data = auth_response.json()
            user_id = user_data["id"]
            
            # Create user profile in Supabase database
            profile_url = f"{supabase_url}/rest/v1/user_profiles"
            profile_headers = {
                "Authorization": f"Bearer {supabase_service_key}",
                "Content-Type": "application/json",
                "apikey": supabase_service_key
            }
            profile_data = {
                "id": user_id,
                "email": email,
                "fullName": name,
                "role": role.lower().replace(" ", "_")  # Convert "Super User" to "super_user"
            }
            
            profile_response = client.post(profile_url, json=profile_data, headers=profile_headers)
            profile_response.raise_for_status()
            
            print(f"Successfully created Supabase user: {email}")
            return True
            
    except Exception as e:
        print(f"Error creating Supabase user: {str(e)}")
        return False


def generate_reset_link(user_email: str):
    """Generate password reset link (placeholder)"""
    return f"https://yourapp.com/reset-password?email={user_email}"


