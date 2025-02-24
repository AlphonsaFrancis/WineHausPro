from django.db import models
from authentication.models import User
from orders.constants import ORDER_STATUS
from products.models import Product

class Order(models.Model):
    order_id = models.AutoField(primary_key=True)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    order_date = models.DateTimeField()
    order_status = models.CharField(max_length=50)
    tax_amount = models.FloatField()
    total_amount = models.FloatField()
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"Order {self.order_id} - {self.order_status}"


class OrderItems(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE,null=True, default=None)
    order_item_id = models.AutoField(primary_key=True)
    order_id = models.ForeignKey(Order, on_delete=models.CASCADE)
    product_id = models.ForeignKey(Product, on_delete=models.CASCADE)
    order_status=models.CharField(max_length=55, choices=ORDER_STATUS, default='placed')
    quantity = models.IntegerField()
    price = models.FloatField()
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)


    def __str__(self):
        return f"{self.order_item_id}"


class Wishlist(models.Model):
    wishlist_id = models.AutoField(primary_key=True)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Wishlist {self.wishlist_id} for User {self.user_id}"


class WishlistItems(models.Model):
    wishlist_item_id = models.AutoField(primary_key=True)
    wishlist_id = models.ForeignKey(Wishlist, on_delete=models.CASCADE)
    product_id = models.ForeignKey(Product, on_delete=models.CASCADE)
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Wishlist Item {self.wishlist_item_id} for Wishlist {self.wishlist_id}"


class Cart(models.Model):
    cart_id = models.AutoField(primary_key=True)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Cart {self.cart_id} for User {self.user_id}"


class CartItems(models.Model):
    cart_item_id = models.AutoField(primary_key=True)
    cart_id = models.ForeignKey(Cart, on_delete=models.CASCADE)
    product_id = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Cart Item {self.cart_item_id} for Cart {self.cart_id}"



class Payment(models.Model):
    PAYMENT_METHOD_CHOICES = [
        ('online', 'Online'),
        ('cod', 'Cash on Delivery'),
    ]

    payment_id = models.CharField(max_length=255, blank=True, null=True)
    order_id = models.ForeignKey(Order, on_delete=models.SET_NULL, null=True, blank=True)  # Link to Order model
    cart_id = models.ForeignKey(Cart, on_delete=models.CASCADE)
    amount = models.FloatField()
    payment_method = models.CharField(max_length=10, choices=PAYMENT_METHOD_CHOICES, default='online')
    is_successful = models.BooleanField(default=False)
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Payment {self.payment_id or 'N/A'} for Cart {self.cart_id}"   

class Address(models.Model):
    address_id = models.AutoField(primary_key=True)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    address_line1 = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    country = models.CharField(max_length=100)
    pincode = models.CharField(max_length=20)
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Address {self.address_id} for User {self.user_id}"


class Shipping(models.Model):
    shipping_id = models.AutoField(primary_key=True)
    order_id = models.ForeignKey(Order, on_delete=models.CASCADE)
    address_id = models.ForeignKey(Address, on_delete=models.CASCADE)
    shipping_date = models.DateTimeField()
    tracking_number = models.CharField(max_length=100)
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Shipping {self.shipping_id} for Order {self.order_id}"
    
class OrderPaymentTransaction(models.Model):
    user_id =  models.ForeignKey(User, on_delete=models.CASCADE)
    order_id = models.ForeignKey(OrderItems, on_delete=models.CASCADE)
    paymentfrom_wallet = models.FloatField()
    payment_from_cod = models.FloatField()
    payment_from_online = models.FloatField()
    total_amount = models.FloatField() 
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)
