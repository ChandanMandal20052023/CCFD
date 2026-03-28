# MySQL Configuration for CCFD

This document outlines the steps to migrate the CCFD backend from SQLite to MySQL.

## 1. Prerequisites
- MySQL Server installed and running.
- A database created for the project (e.g., `ccfd_db`).
- A user with appropriate permissions.

## 2. Install Dependencies
Run the following command in your virtual environment:
```bash
pip install mysqlclient
```

## 3. Update `backend/backend/settings.py`
Replace the `DATABASES` section with:

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'ccfd_db',
        'USER': 'your_mysql_user',
        'PASSWORD': 'your_mysql_password',
        'HOST': 'localhost',
        'PORT': '3306',
    }
}
```

## 4. Run Migrations
After updating the settings, run the following commands:
```bash
python manage.py makemigrations
python manage.py migrate
```
