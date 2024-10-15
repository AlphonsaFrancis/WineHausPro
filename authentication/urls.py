from django.urls import path
from .views import add_new_user, delete_user, get_all_users, update_user, user_registration,user_login,google_sign_in
from .views import password_reset_request, password_reset_confirm,check_email_exists


urlpatterns = [
    path('register/', user_registration),
    path('login/',user_login),
    path('password-reset/', password_reset_request, name='password-reset'),
    path('reset-password/<uidb64>/<token>/', password_reset_confirm, name='reset-password'),
    path('auth-google/', google_sign_in, name='auth-google'),
    path('users/', get_all_users, name='get_all_users'),
    path('users/<int:user_id>/delete/', delete_user, name='delete_user'),
    path('add-new-user/', add_new_user, name='add_new_user'),
    path('update-user/<int:user_id>/', update_user, name='update_user'),
    path('users/check-email-exists/', check_email_exists, name='check_email_exists'),

]

 
