from django.urls import path
from . import views

urlpatterns = [
    path('list/', views.staff_list, name='staff_list'),
    path('details/<int:pk>/', views.staff_detail, name='staff_detail'),
    path('create/', views.staff_create, name='staff_create'),  # Create API
    path('update/<int:pk>/', views.staff_update, name='staff_update'),  # Update API
    path('delete/<int:pk>/', views.staff_delete, name='staff_delete'),  # Delete API
]
