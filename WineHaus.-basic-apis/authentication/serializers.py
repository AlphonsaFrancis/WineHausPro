from datetime import timezone
from rest_framework import serializers
from .models import User,User_profile

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User_profile
        fields = '__all__'

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('email', 'password', 'date_joined', 'is_staff', 'is_active', 'is_profile_completed', 'last_login')

    def create(self, validated_data):
        email = validated_data['email']
        password = validated_data['password']
        date_joined = validated_data['date_joined']
        is_staff = validated_data['is_staff']
        is_active = validated_data['is_active']
        is_profile_completed = validated_data['is_profile_completed']
        last_login = validated_data['last_login']

        user = User.objects.create_user(
            email=email,
            password=password,
            date_joined=date_joined,
            is_staff=is_staff,
            is_active=is_active,
            last_login=last_login
        )

        user.is_profile_completed = is_profile_completed
        user.save()

        return user
    

class UserUpdateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = ('email', 'password', 'is_active', 'is_profile_completed')

    def update(self, instance, validated_data):
        instance.email = validated_data.get('email', instance.email)
        instance.is_active = validated_data.get('is_active', instance.is_active)
        instance.is_profile_completed = validated_data.get('is_profile_completed', instance.is_profile_completed)

        password = validated_data.get('password', None)
        if password:
            instance.set_password(password)

        instance.save()
        return instance


class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()
 
    def validate_email(self, value):
        try:
            user = User.objects.get(email=value)
        except User.DoesNotExist:
            raise serializers.ValidationError("There is no user registered with this email address.")
        return value
 
 
class PasswordResetConfirmSerializer(serializers.Serializer):
    new_password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)
 
    def validate(self, data):
        if data['new_password'] != data['confirm_password']:
            raise serializers.ValidationError("Passwords do not match.")
        return data
