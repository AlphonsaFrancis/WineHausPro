from django.shortcuts import get_object_or_404, render
import requests
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import User
from .serializers import UserRegistrationSerializer, UserSerializer, UserUpdateSerializer
from django.contrib.auth.hashers import make_password
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.utils.http import urlsafe_base64_encode,urlsafe_base64_decode
from django.utils.encoding import force_bytes
from django.template.loader import render_to_string
from .serializers import PasswordResetRequestSerializer,PasswordResetConfirmSerializer
from allauth.socialaccount.models import SocialAccount
from django.http import JsonResponse

@api_view(['POST'])
def user_registration(request):
    if request.method == 'POST':
        data = request.data
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return Response({"error": "Email and password are required."}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(email=email).exists():
            return Response({"error": "User with this email already exists."}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create(
            email=email,
            password=make_password(password),
            is_active=True
        )
        
        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response({"error": "Invalid request method."}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

@api_view(['POST'])
def user_login(request):
    if request.method == 'POST':
        data = request.data
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return Response({"error": "Email and password are required."}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(email=email, password=password)
        
        if user is not None:
            if user.is_active:
                refresh = RefreshToken.for_user(user)
                return Response({
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                    'user': UserSerializer(user).data
                }, status=status.HTTP_200_OK)
            else:
                return Response({"error": "Account is disabled."}, status=status.HTTP_403_FORBIDDEN)
        else:
            return Response({"error": "Invalid credentials."}, status=status.HTTP_401_UNAUTHORIZED)


# function for senting password reset link
@api_view(['POST'])
def password_reset_request(request):
    serializer = PasswordResetRequestSerializer(data=request.data)
    if serializer.is_valid():
        user = User.objects.get(email=serializer.validated_data['email'])
        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        reset_link = f"{request.scheme}://{request.get_host()}/api/v1/auth/reset-password/{uid}/{token}/"
        message = render_to_string('password_reset_email.html', {
            'user': user,
            'reset_link': reset_link,
        })
        send_mail(
            'Password Reset Request',
            message,
            'no-reply@example.com',
            [user.email],
            fail_silently=False,
        )
        return Response({"message": "Password reset link has been sent to your email."}, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


 

@api_view(['GET', 'POST'])
def password_reset_confirm(request, uidb64, token):
    if request.method == 'GET':
        return render(request, 'password_reset_form.html', context={'uidb64': uidb64, 'token': token})
 
    serializer = PasswordResetConfirmSerializer(data=request.data)
    if serializer.is_valid():
        try:
            uid = urlsafe_base64_decode(uidb64).decode()
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response({"error": "Invalid reset link"}, status=status.HTTP_400_BAD_REQUEST)
 
        if not default_token_generator.check_token(user, token):
            return Response({"error": "Invalid or expired token"}, status=status.HTTP_400_BAD_REQUEST)
 
        if request.data.get('new_password') != request.data.get('confirm_password'):
            return Response({"error": "Passwords do not match"}, status=status.HTTP_400_BAD_REQUEST)
 
        user.set_password(serializer.validated_data['new_password'])
        user.save()
 
        return Response({"message": "Password has been reset successfully."}, status=status.HTTP_200_OK)
 
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# 

@api_view(['POST'])
def google_sign_in(request):
    access_token = request.data.get('token')
    print("Received access_token:", access_token)
    if not access_token:
        return Response({'error': 'Token is required'}, status=status.HTTP_400_BAD_REQUEST)

    # Verify the access token with Google
    google_response = requests.get(
        f"https://www.googleapis.com/oauth2/v1/userinfo?access_token={access_token}"
    )

    if google_response.status_code != 200:
        return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)

    google_data = google_response.json()
    email = google_data.get('email')
    # first_name = google_data.get('given_name')
    # last_name = google_data.get('family_name')
    # google_user_id = google_data.get('id')

    # Use the google_user_id to identify the user
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        user = User.objects.create(
            email=email,
            # first_name=first_name,
            # last_name=last_name,
            # username=email  # or any other unique identifier
        )
        user.save()

    # Generate JWT tokens
    refresh = RefreshToken.for_user(user)
    access_token = str(refresh.access_token)

    return Response({
        'access_token': access_token,
        'refresh_token': str(refresh),
        'user': {
            'id': user.id,
            'email': user.email,
            # 'first_name': user.first_name,
            # 'last_name': user.last_name,
        }
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
def get_all_users(request):
    users = User.objects.all()
    serializer = UserSerializer(users,many=True)
    if serializer.is_valid:
        return Response(serializer.data, status=status.HTTP_200_OK)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

@api_view(['DELETE'])
def delete_user(request, user_id):
    user = get_object_or_404(User, id=user_id)
    user.delete()
    return Response({"message": "User deleted successfully."}, status=status.HTTP_204_NO_CONTENT)

@api_view(['POST'])
def add_new_user(request):
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({'message': 'User registered successfully!'}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
def update_user(request, user_id):
    try:
        user = User.objects.get(pk=user_id)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

    serializer = UserUpdateSerializer(user, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response({'message': 'User updated successfully!'}, status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def check_email_exists(request):
    email = request.GET.get('email')
    exists = User.objects.filter(email=email).exists()
    return JsonResponse({'exists': exists})

