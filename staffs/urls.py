from django.urls import path
from . import views

urlpatterns = [
    path('list/', views.staff_list, name='staff_list'),
    path('details/<int:pk>/', views.staff_detail, name='staff_detail'),
]
