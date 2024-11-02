from django.db import models

from authentication.models import User


class Staff(models.Model):
    staff_id = models.AutoField(primary_key=True)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)  # Assuming user_id references the Django User model
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    phone = models.CharField(max_length=15)
    designation = models.CharField(max_length=100)
    hire_date = models.DateTimeField()
    salary = models.FloatField()
    is_active = models.BooleanField(default=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name} - {self.designation}"

