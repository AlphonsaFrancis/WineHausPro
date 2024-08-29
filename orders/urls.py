from django.urls import path
from . import views

urlpatterns = [
    path('list/', views.order_list, name='order_list'),
    path('details/<int:pk>/', views.order_detail, name='order_detail'),
    path('items-list/', views.order_items_list, name='order_items_list'),
    path('items-detail/<int:pk>/', views.order_item_detail, name='order_item_detail'),
    path('wishlist-list/', views.wishlist_list, name='wishlist_list'),
    path('wishlist-detail/<int:pk>/', views.wishlist_detail, name='wishlist_detail'),
    path('wishlist-items-list/', views.wishlist_items_list, name='wishlist_items_list'),
    path('wishlist-items-details/<int:pk>/', views.wishlist_item_detail, name='wishlist_item_detail'),
    path('cart-list/', views.cart_list_create, name='cart-list-create'),
    path('carts-detail/<int:pk>/', views.cart_detail, name='cart-detail'),
    path('cart-items-create/', views.cart_items_list_create, name='cart-items-list-create'),
    path('cart-items-detail/<int:pk>/', views.cart_items_detail, name='cart-items-detail'),
    path('payment-list-create/', views.payment_list_create, name='payment-list-create'),
    path('payment-details/<int:pk>/', views.payment_detail, name='payment-detail'),

]
