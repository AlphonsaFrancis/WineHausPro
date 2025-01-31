FROM python:3.13.1-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Copy requirements first to leverage Docker cache
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt gunicorn

# Copy start script and make it executable
COPY start.sh /app/
RUN chmod +x /app/start.sh

# Copy the rest of the application
COPY . /app/

# Collect static files
RUN python manage.py collectstatic --noinput

EXPOSE 8000

# Use bash to run the start script
CMD ["bash", "/app/start.sh"]