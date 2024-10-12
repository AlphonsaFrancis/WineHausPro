from django.urls import path
from .views import delete_user, get_all_users, user_registration,user_login,google_sign_in
from .views import password_reset_request, password_reset_confirm


urlpatterns = [
    path('register/', user_registration),
    path('login/',user_login),
    path('password-reset/', password_reset_request, name='password-reset'),
    path('reset-password/<uidb64>/<token>/', password_reset_confirm, name='reset-password'),
    path('auth-google/', google_sign_in, name='auth-google'),
    path('users/', get_all_users, name='get_all_users'),
    path('users/<int:user_id>/delete/', delete_user, name='delete_user'),
]

 
