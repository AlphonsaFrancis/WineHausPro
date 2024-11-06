from django.urls import path
from . import views


urlpatterns = [
    path('list/', views.order_list, name='order_list'),
    path('details/<int:pk>/', views.order_detail, name='order_detail'),
    path('delete/<int:pk>/', views.delete_order, name='delete_order'),
    path('update/<int:pk>/', views.update_order, name='update_order'),
    path('disable-enable-order/<int:pk>/',views.disable_enable_order,name='disable_enable_order'),
    path('order-items/delete/<int:pk>/', views.delete_order_item, name='delete_order_item'),
    path('items-list/<int:order_id>/', views.order_items_list, name='order_items_list'),
    path('items-detail/<int:pk>/', views.order_item_detail, name='order_item_detail'),

    path('wishlist-list/', views.wishlist_list_create, name='wishlist-list-create'),
    path('wishlist-items-create/', views.wishlist_items_list_create, name='wishlist-items-create'),
    path('wishlist-items/<int:pk>/', views.wishlist_items_detail, name='wishlist-items-detail'),
 
    path('cart-list/', views.cart_list_view, name='cart-list'),  # For listing/creating carts
    path('carts-detail/<int:pk>/', views.cart_detail, name='cart-detail'),  # Detailed cart view
    path('cart-items/', views.cart_items_list_view, name='cart-items-list'),  # For getting cart items
    path('cart-items-create/', views.cart_items_list_create, name='cart-items-create'),  # Adding items to the cart
    path('cart-items-detail/<int:pk>/', views.cart_items_detail, name='cart-items-detail'),  # Detailed item view
    path('cart-items/clear/',views. clear_cart_items, name='clear-cart-items'),

    path('payments/create/', views.create_payment, name='create_payment'),
    path('payments/verify/', views.verify_payment, name='verify_payment'),

    path('address-list/', views.address_list, name='address-list'),
    path('address-detail/<int:pk>/', views.address_detail, name='address-detail'),
    path('addresses/create/', views.create_address, name='address-create'),
    path('addresses/<int:pk>/update/', views.update_address, name='address-update'),
    path('addresses/<int:pk>/delete/', views.delete_address, name='address-delete'),

    path('shipping-list/', views.shipping_list, name='shipping-list'),
    path('shippings-details/<int:pk>/', views.shipping_detail, name='shipping-detail'),
    path('shippings-create/', views.shipping_create, name='shipping-create'),
    path('shippings-update/<int:pk>/update/', views.shipping_update, name='shipping-update'),
    path('shippings-delete/<int:pk>/delete/', views.shipping_delete, name='shipping-delete'),

    path('user-orders/<int:user_id>/', views.user_orders, name='user_orders'),
    path('order-items/<int:order_id>/', views.order_items, name='order_items'),
]



