# 
from django.conf import settings
from django.shortcuts import get_object_or_404, render
import requests
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import OtpRecord, TempUser, User
from .serializers import UserRegistrationSerializer, UserSerializer, UserUpdateSerializer
from django.contrib.auth.hashers import make_password
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.utils.http import urlsafe_base64_encode,urlsafe_base64_decode
from django.utils.encoding import force_bytes
from django.utils import timezone
from django.template.loader import render_to_string
from .serializers import PasswordResetRequestSerializer,PasswordResetConfirmSerializer
from allauth.socialaccount.models import SocialAccount
from django.http import JsonResponse
import random

from django.utils.timezone import now, timedelta
from django.http import JsonResponse
from django.db.models.functions import TruncDate
from django.db.models import Count
from rest_framework.exceptions import APIException
from django.core.exceptions import ValidationError

def generate_otp(email):
    try:
        otp =  str(random.randint(100000, 999999))
        print('OTP::',otp)
        if OtpRecord.objects.filter(email=email).exists():
            otp_record = OtpRecord.objects.get(email=email)
            otp_record.otp = otp
            otp_record.save()
            print("record updated")
        else:
            OtpRecord.objects.create(email=email, otp=otp)
            print("New record created")
        return otp
    except Exception as e:
        print("ERROR:: ", str(e))
        return str(e)


def validate_otp(email,otp):
    try:
        otp_record = OtpRecord.objects.get(email=email)
        if otp_record.otp == otp:
            otp_record.delete()
            return True
        else:
            return False
    except Exception as e:
        print("ERROR:: ", str(e))
        return False
    

def send_otp_email(recipient_email, otp):
    print("Sending OTP as email...")
    subject = "Your OTP Code"
    message = f"Dear user,\n\nYour OTP code is: {otp}\n\nPlease use this code to complete your registration to Winehaus"
    email_from = settings.EMAIL_HOST_USER
    recipient_list = [recipient_email]

    try:
        send_mail(subject, message, email_from, recipient_list)
        return {"success": True, "message": "OTP sent successfully"}
    except Exception as e:
        return {"success": False, "message": f"Failed to send OTP: {str(e)}"}


@api_view(['POST'])
def initiate_registration(request):
    if request.method == 'POST':
        data = request.data
        email = data.get('email')
        password = data.get('password')
        name = data.get('name')

        if not email or not password:
            return Response({"error": "Email and password are required."}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(email=email).exists():
            return Response({"error": "User with this email already exists."}, status=status.HTTP_400_BAD_REQUEST)

        # user = User.objects.create(
        #     email=email,
        #     password=make_password(password),
        #     is_active=True
        # )
        
        # serializer = UserSerializer(user)
        # return Response(serializer.data, status=status.HTTP_201_CREATED)

        otp = generate_otp(email)
        hashed_password = make_password(password)
        if otp:
            temp_user = TempUser.objects.create(email=email, password=hashed_password,name=name)
        send_otp_email(email, otp)
        return Response({"message": "OTP sent to your email."}, status=status.HTTP_201_CREATED)
    return Response({"error": "Invalid request method."}, status=status.HTTP_405_METHOD_NOT_ALLOWED)


@api_view(['POST'])
def validate_otp_and_register(request):
    if request.method == 'POST':
        data = request.data
        email = data.get('email')
        otp = data.get('otp')

        if not email or not otp:
            return Response({"error": "Email and OTP are required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            temp_user = TempUser.objects.get(email=email)
            if validate_otp(email,otp):
                user = User.objects.create(
                    email=temp_user.email,
                    password=temp_user.password,
                    name = temp_user.name,
                    is_active=True
                )
                temp_user.delete()  
                otp_record = OtpRecord.objects.filter(email=email).delete()
                serializer = UserSerializer(user)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                return Response({"error": "Invalid OTP."}, status=status.HTTP_400_BAD_REQUEST)

        except TempUser.DoesNotExist:
            return Response({"error": "Temporary user not found."}, status=status.HTTP_404_NOT_FOUND)
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
                user.last_login = timezone.now()
                user.save(update_fields=['last_login'])
                refresh = RefreshToken.for_user(user)
                return Response({
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                    'user': UserSerializer(user).data,
                    'user_id': user.id,
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


# # 

# @api_view(['POST'])
# def google_sign_in(request):
#     access_token = request.data.get('token')
#     print("Received access_token:", access_token)
#     if not access_token:
#         return Response({'error': 'Token is required'}, status=status.HTTP_400_BAD_REQUEST)

#     # Verify the access token with Google
#     google_response = requests.get(
#         f"https://www.googleapis.com/oauth2/v1/userinfo?access_token={access_token}"
#     )

#     if google_response.status_code != 200:
#         return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)

#     google_data = google_response.json()
#     email = google_data.get('email')
#     first_name = google_data.get('given_name')
#     last_name = google_data.get('family_name')
#     try:
#         user = User.objects.get(email=email)
#     except User.DoesNotExist:
#         user = User.objects.create(
#             email=email,
#             first_name=first_name,
#             last_name=last_name,
#         )
#         user.save()

#     refresh = RefreshToken.for_user(user)
#     access_token = str(refresh.access_token)

#     return Response({
#         'access_token': access_token,
#         'refresh_token': str(refresh),
#         'user': {
#             'id': user.id,
#             'email': user.email,
#             # 'first_name': user.first_name,
#             # 'last_name': user.last_name,
#         }
#     }, status=status.HTTP_200_OK)

@api_view(['POST'])
def google_sign_in(request):
    access_token = request.data.get('token')
    print("Received access_token:", access_token)
    if not access_token:
        return Response({'error': 'Token is required'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Verify the access token with Google
        google_response = requests.get(
            f"https://www.googleapis.com/oauth2/v1/userinfo?access_token={access_token}"
        )
        
        if google_response.status_code != 200:
            return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)

        google_data = google_response.json()
        email = google_data.get('email')
        first_name = google_data.get('given_name', '')  
        last_name = google_data.get('family_name', '')  


        try:
            user = User.objects.get(email=email)
            user.name = first_name
            user.save()
        except User.DoesNotExist:
            user = User.objects.create_user(  
                email=email,
                name=first_name,
                password=None
            )

        user.last_login = timezone.now()
        user.save(update_fields=['last_login'])

        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)

        return Response({
            'access_token': access_token,
            'refresh_token': str(refresh),
            'user': {
                'id': user.id,
                'email': user.email,
                'name': user.name,
            }
        }, status=status.HTTP_200_OK)

    except requests.exceptions.RequestException as e:
        return Response({'error': 'Failed to verify token with Google'},
                       status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


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
    return Response({"message": "User deleted successfully."}, status=status.HTTP_200_OK)

@api_view(['POST'])
def add_new_user(request):
    print(request.data)
    data = request.data
    email = data.get('email')
    password = data.get('password')
    date_joined = data.get('dateJoined')
    is_staff = data.get('isStaff') == "true"
    is_active = data.get('isActive') == "true"
    is_superuser = data.get('isSuperUser') == "true"
    is_profile_completed = data.get('isProfileCompleted') == "true"
    is_delivery_agent = data.get('isDeliveryAgent') == "true"
    is_supplier = data.get('isSupplier') == "true"

    last_login = data.get('lastLogin')

    user = User(
        email=email,
        date_joined=date_joined,
        is_staff=is_staff,
        is_active=is_active,
        is_superuser=is_superuser,
        is_profile_completed=is_profile_completed,
        last_login=last_login,
        is_delivery_agent=is_delivery_agent,
        is_supplier=is_supplier
    )
    user.set_password(password)  
    user.save()

    return Response({'message': 'User registered successfully!' ,'id':user.id,'password':password}, status=status.HTTP_201_CREATED)


@api_view(['PUT'])
def edit_user(request, user_id):
    data = request.data
    print(data)
    user = get_object_or_404(User, id=user_id)

    email = data.get('email')
    if email and User.objects.filter(email=email).exclude(id=user.id).exists():
        return Response({'error': 'Email is already taken.'}, status=status.HTTP_400_BAD_REQUEST)

    user.email = data.get('email', user.email)
    if 'password' in data and data['password']:
        user.password = make_password(data['password'])  # Update password only if provided
    user.date_joined = data.get('dateJoined', user.date_joined)
    user.is_staff = data.get('isStaff') == True if 'isStaff' in data else user.is_staff
    user.is_active = data.get('isActive') == True if 'isActive' in data else user.is_active
    user.is_superuser = data.get('isSuperUser') == True if 'isSuperUser' in data else user.is_superuser
    user.is_profile_completed = data.get('isProfileCompleted') == True if 'isProfileCompleted' in data else user.is_profile_completed
    user.is_delivery_agent = data.get('isDeliveryAgent') == True if 'isDeliveryAgent' in data else user.is_delivery_agent
    user.is_supplier = data.get('isSupplier') == True if 'isSupplier' in data else user.is_supplier

    user.last_login = data.get('lastLogin', user.last_login)

    # Save the changes
    user.save()

    return Response({'message': 'User updated successfully!'}, status=status.HTTP_200_OK)


@api_view(['POST'])
def disable_enable_user(request,pk):
    try:
        user = User.objects.get(pk=pk)
        if user.is_active == True:
            user.is_active  = False
        else:
            user.is_active = True
        user.save()
        return Response({'message':f"user active status changed to : {user.is_active} "},status=status.HTTP_200_OK)
    except User.DoesNotExist:
        print(f"ERROR: user for this id doesnot exist!")
        return Response({'message': f"No user found for the given id {pk}"},status=status.HTTP_204_NO_CONTENT)
    except Exception as e:
        print(f"ERROR: {e}")
        return Response({'message': f"An error occurred while processing your request"},status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    

@api_view(['GET'])
def check_email_exists(request):
    email = request.GET.get('email')
    exists = User.objects.filter(email=email).exists()
    return JsonResponse({'exists': exists})


# API FOR GETTING NUMBER OF LOGGED IN USERS PER DAY


@api_view(['GET'])
def daily_logged_in_users(request):
    try:
        days_param = request.GET.get('days', 7)
        try:
            days = int(days_param)
            if days <= 0:
                raise ValueError("The number of days must be a positive integer.")
        except (ValueError, TypeError) as e:
            return JsonResponse({'error': "Invalid 'days' parameter. Must be a positive integer."}, status=400)

        start_date = now() - timedelta(days=days)
        print("start-date",start_date)

        # Aggregate the number of users logged in per day
        daily_counts = (
            User.objects.filter(last_login__gte=start_date)
            .annotate(date=TruncDate('last_login'))
            .values('date')
            .annotate(count=Count('id'))
            .order_by('date')
        )

        data = [{'date': entry['date'], 'logged_in_users_count': entry['count']} for entry in daily_counts]

        return JsonResponse({'days': days, 'data': data}, status=200)

    except ValidationError as ve:
        return JsonResponse({'error': f"Validation error occurred.{str(ve)}"}, status=400)

    except APIException as api_exception:
        return JsonResponse({'error': f"An error occurred while processing your request, {str(api_exception)}"}, status=500)

    except Exception as e:
        return JsonResponse({'error': f"An unexpected error occurred. Please try again later. {str(e)}"}, status=500)