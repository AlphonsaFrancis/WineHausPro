# Use Python 3.11 slim image
FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV DJANGO_SETTINGS_MODULE=winehauspro.settings
ENV DJANGO_SECRET_KEY="django-insecure-m787wmo#61d-+3-n7e30t!%rex=qd=x)i9fcfub3ilwairai32"

# Set work directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    nginx \
    postgresql \
    postgresql-contrib \
    libpq-dev \
    python3-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy project
COPY . .

# Copy Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Collect static files
RUN python manage.py collectstatic --noinput

# Expose ports
EXPOSE 80 443

# Start Nginx and Gunicorn
CMD service nginx start && gunicorn winehauspro.wsgi:application --bind 0.0.0.0:8000