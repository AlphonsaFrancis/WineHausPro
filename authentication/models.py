from django.db import models
from django.contrib.auth.models import AbstractBaseUser


class User(AbstractBaseUser):
    username=models.CharField(max_length=255,unique=True)
    email=models.CharField(max_length=255,unique=True)
    password=models.CharField(max_length=255)
    date_joined=models.DateTimeField()
    is_staff=models.BooleanField(default=False)
    is_active=models.BooleanField(default=True)
    is_profile_completed=models.BooleanField(default=False)
    last_login=models.DateTimeField()
    updated_at=models.DateTimeField(auto_now=True)
    created_at=models.DateTimeField(auto_now_add=True)

    USERNAME_FIELD='email'
    REQUIRED_FIELDS=['email']
    def __str__(self):
        return self.email
    
    
class User_profile(models.Model):
    user=models.ForeignKey(User,on_delete=models.CASCADE)
    first_name=models.CharField(max_length=255)
    last_name=models.CharField(max_length=255)
    phone=models.CharField(max_length=255)
    default_address=models.CharField(max_length=255)
    default_city=models.CharField(max_length=255)
    default_state=models.CharField(max_length=255)
    default_pincode=models.CharField(max_length=255)
    updated_at=models.DateTimeField(auto_now=True)
    created_at=models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.first_name
