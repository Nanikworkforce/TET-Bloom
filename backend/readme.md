# 🛠 Django API – Setup Guide

This is the backend API built with Django and Django REST Framework. It supports user roles (Teacher, Admin, etc.) and provides full CRUD operations for managing teacher and user data.

## 🚀 Getting Started

Follow these steps to set up and run the Django API locally.

---

## 📦 Requirements

- Python 3.8+
- pip
- Git (optional)
- Virtualenv (recommended)


```bash
cd root-backend (cd backend)

# Create virtual environment
python -m venv venv

# Activate (Linux/macOS)
source venv/bin/activate

# Activate (Windows)
. ./venv/Scripts/activate

#Install Dependencies
pip install -r requirements.txt

#Apply Migrations
python manage.py makemigrations
python manage.py migrate

#Create Superuser (Optional)
python manage.py createsuperuser

#Run the server
python manage.py runserver
# server will be live at  http://127.0.0.1:8000