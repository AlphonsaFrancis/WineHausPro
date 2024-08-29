from django.urls import path
from . import views

urlpatterns = [
    path('list/', views.product_list, name='product-list'),         
    path('create/', views.product_create, name='product-create'),
    path('details/<int:pk>/', views.product_detail, name='product-detail'),
    path('update/<int:pk>/', views.product_update, name='product-update'),
    path('delete/<int:pk>/', views.product_delete, name='product-delete'),
    path('category-list/', views.category_list, name='category-list'),
    path('category-create/', views.category_create, name='category-create'),
    path('category-details/<int:pk>/', views.category_detail, name='category-detail'),
    path('category-update/<int:pk>/', views.category_update, name='category-update'),
    path('category-delete/<int:pk>/', views.category_delete, name='category-delete'),
    path('madeof-list/', views.madeof_list, name='madeof-list'),
    path('madeof-details/<int:madeof_id>/', views.madeof_detail, name='madeof-detail'),
    path('brand-list/', views.brand_list, name='brand-list'),
    path('brand-details/<int:pk>/', views.brand_detail, name='brand-detail'),
]
