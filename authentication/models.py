
from django.db import models
from django.contrib.auth.models import AbstractBaseUser,BaseUserManager,PermissionsMixin



# class CustomUserManager(BaseUserManager):
#     def create_user(self, email, password=None, **extra_fields):
#         if not email:
#             raise ValueError('The Email field must be set')
#         email = self.normalize_email(email)
#         user = self.model(email=email, **extra_fields)
#         user.set_password(password)
#         user.save(using=self._db)
#         return user
 
#     def create_superuser(self, email, password=None, **extra_fields):
#         extra_fields.setdefault('is_staff', True)
#         extra_fields.setdefault('is_superuser', True)
 
#         return self.create_user(email, password, **extra_fields)
    
# class User(AbstractBaseUser,PermissionsMixin):
#     # username=models.CharField(max_length=255,unique=True)
#     email=models.CharField(max_length=255,unique=True)
#     name = models.CharField(max_length=255, default=None, null=True)
#     password=models.CharField(max_length=255)
#     date_joined=models.DateTimeField(auto_now_add=True)
#     is_staff=models.BooleanField(default=False)
#     is_active=models.BooleanField(default=True)
#     is_profile_completed=models.BooleanField(default=False) 
#     is_superuser = models.BooleanField(default=False)
#     last_login=models.DateTimeField(null=True)
#     is_delivery_agent = models.BooleanField(default=False)
#     updated_at=models.DateTimeField(auto_now=True)
#     created_at=models.DateTimeField(auto_now_add=True)

#     USERNAME_FIELD='email'
#     objects = CustomUserManager()
#     def __str__(self):
#         return self.email
    


class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)  # Hashes the password correctly
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)  # Use EmailField instead of CharField
    name = models.CharField(max_length=255, default=None, null=True)
    date_joined = models.DateTimeField(auto_now_add=True)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_profile_completed = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    last_login = models.DateTimeField(null=True)
    is_delivery_agent = models.BooleanField(default=False)
    is_supplier = models.BooleanField(default=False)
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    USERNAME_FIELD = 'email'  # Use email as the login field
    REQUIRED_FIELDS = ['name']  # Superusers must provide a name

    objects = CustomUserManager()

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

    def _str_(self):
        return self.first_name
    
class OtpRecord(models.Model):
    email=models.EmailField(null=True)
    otp = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)

    def _str_(self):
        return self.email

class TempUser(models.Model):
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def _str_(self):
        return self.email