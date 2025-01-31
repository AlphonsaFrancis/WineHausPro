FROM python:3.13.1-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt gunicorn

# Copy the Django project
COPY . /app/

# Collect static files
RUN python manage.py collectstatic --noinput

EXPOSE 8000

# Create start script
RUN echo '#!/bin/bash\ngunicorn --bind 0.0.0.0:8000 winehauspro.wsgi:application' > /app/start.sh && \
    chmod +x /app/start.sh

# Use the start script as the command
CMD ["/app/start.sh"]