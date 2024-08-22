from django.urls import path
from .views import user_registration,user_login,google_sign_in
from .views import password_reset_request, password_reset_confirm


urlpatterns = [
    path('register/', user_registration),
    path('login/',user_login),
    path('password-reset/', password_reset_request, name='password-reset'),
    path('reset-password/<uidb64>/<token>/', password_reset_confirm, name='reset-password'),
    # path('password-reset/', include('django_rest_passwordreset.urls', namespace='password-reset')),
    path('auth-google/', google_sign_in, name='auth-google'),
]

 
