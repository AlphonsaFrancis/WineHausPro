from rest_framework import serializers
from .models import Order, OrderItems,Wishlist, WishlistItems,Cart, CartItems,Payment



class OrderItemsSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItems
        fields = '__all__'

class OrderSerializer(serializers.ModelSerializer):
    order_items = OrderItemsSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = '__all__'


class WishlistItemsSerializer(serializers.ModelSerializer):
    class Meta:
        model = WishlistItems
        fields = '__all__'

class WishlistSerializer(serializers.ModelSerializer):
    wishlist_items = WishlistItemsSerializer(many=True, read_only=True)

    class Meta:
        model = Wishlist
        fields = '__all__'        


class CartSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cart
        fields = '__all__'

class CartItemsSerializer(serializers.ModelSerializer):
    class Meta:
        model = CartItems
        fields = '__all__'


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = '__all__'
