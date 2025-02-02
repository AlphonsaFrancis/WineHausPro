from django.shortcuts import render
from orders.utils import generate_dynamic_colors
from products.serializers import ReviewSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from authentication.models import Transactions, User, UserWallet
from .models import Order, OrderItems,Wishlist, WishlistItems,Cart, CartItems,Payment,Address,Shipping
from .serializers import OrderSerializer, OrderItemsSerializer,WishlistSerializer, WishlistItemsSerializer
from .serializers import CartSerializer, CartItemsSerializer,PaymentSerializer,AddressSerializer,ShippingSerializer
from products.models import Product, Review
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from django.db.models import Count
from django.utils.timezone import now, timedelta

@api_view(['GET'])
def user_orders(request, user_id):
    try:
        orders = Order.objects.filter(user_id=user_id)
        
        if not orders.exists():
            return Response({'error': 'No orders found for this user'}, status=status.HTTP_404_NOT_FOUND)
            
        serialized_orders = []

        for order in orders:
            order_serializer = OrderSerializer(order)
            order_items = OrderItems.objects.filter(order_id=order.order_id)
            order_items_serializer = OrderItemsSerializer(order_items, many=True)
            
            # Initialize products_reviewed as a dictionary
            products_reviewed = {}

            for order_item in order_items:
                # Get all reviews for this product
                reviews = Review.objects.filter(
                    user_id=user_id,
                    product_id=order_item.product_id.product_id,
                    order_id=order.order_id  # Filter by the current order's ID
                )

                product_id = str(order_item.product_id.product_id)
                
                if reviews.exists():
                    for review in reviews:
                        products_reviewed[product_id] = {
                            'has_review': True,
                            'order_id': review.order_id
                        }
                else:
                    products_reviewed[product_id] = {
                        'has_review': False,
                        'order_id': None
                    }

            serialized_orders.append({
                'order': order_serializer.data,
                'order_items': order_items_serializer.data,
                'products_reviewed': products_reviewed
            })

        return Response(serialized_orders, status=status.HTTP_200_OK)

    except Exception as e:
        return Response(
            {'error': f'An error occurred: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

    
@api_view(['GET'])
def order_items(request, order_id):
    try:
        items = OrderItems.objects.filter(order_id=order_id)
        serializer = OrderItemsSerializer(items, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
@api_view(['GET', 'POST'])
def order_list(request):
    if request.method == 'GET':
        orders = Order.objects.all()
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = OrderSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def order_detail(request, pk):
    try:
        order = Order.objects.get(pk=pk)
    except Order.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = OrderSerializer(order)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        serializer = OrderSerializer(order, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        order.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
       

@api_view(['DELETE'])
def delete_order(request, pk):
    try:
        order = Order.objects.get(pk=pk)
    except Order.DoesNotExist:
        return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)
    try:
        order_item = OrderItems.objects.filter(order_id=pk)
    except OrderItems.DoesNotExist:
        order_item=None

    if request.method == 'DELETE':
        order.delete()
        if order_item:
            order_item.delete()
        return Response({'message': 'Order deleted successfully'}, status=status.HTTP_200_OK)


@api_view(['PUT'])
def update_order(request, pk):
    try:
        order = Order.objects.get(pk=pk)
    except Order.DoesNotExist:
        return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'PUT':
        serializer = OrderSerializer(order, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
def delete_order_item(request, pk):
    try:
        order_item = OrderItems.objects.get(pk=pk)
    except OrderItems.DoesNotExist:
        return Response({'error': 'Order Item not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'DELETE':
        order_item.delete()
        return Response({'message': 'Order Item deleted successfully'}, status=status.HTTP_204_NO_CONTENT)


@api_view(['GET', 'POST'])
def order_items_list(request,order_id):
    if request.method == 'GET':
        order = Order.objects.get(order_id=order_id)
        order_items = OrderItems.objects.filter(order_id=order)
        serializer = OrderItemsSerializer(order_items, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = OrderItemsSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def order_item_detail(request, pk):
    try:
        order_item = OrderItems.objects.get(pk=pk)
    except OrderItems.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = OrderItemsSerializer(order_item)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        serializer = OrderItemsSerializer(order_item, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        order_item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    

@api_view(['POST'])
def update_order_status(request, orderItemId):
    try:
        order_status = request.data.get('order_status')
        userId = request.data.get('userId')
        order_item = OrderItems.objects.get(order_item_id=orderItemId)
        user = User.objects.get(id=userId)
        if order_item:
            order_item.order_status = order_status
            order_item.save()

        if order_status == 'cancelled':
            print("Order amount is transfering to wallet")
            try:
                wallet = UserWallet.objects.get(user=user)
                wallet.wallet_amount += order_item.price
                wallet.save()
            except UserWallet.DoesNotExist:
                UserWallet.objects.create(
                    user = user,
                    wallet_amount = order_item.price
                )

            try:
                Transactions.objects.create(
                    user = user,
                    transaction_id = f"TRA_ORD {str(order_item.order_item_id)}",
                    transaction_status = 'success',
                    transaction_amount = order_item.price,
                    transaction_type='credit',
                    transaction_desc = f"Refund of order id : {str(order_item.order_item_id)}"
                )
            except Exception as e:
                print(e)
                pass
            

        return Response({
            "success":True,
            "message":"Order status updated",
            "data":{
                order_status:order_status
            },
            "status":200
        },200)
    except OrderItems.DoesNotExist:
        return Response({
            "success":False,
            "message":"No order item found for this id ",
            "error":"No order item found for this id ",
            "status":400

        },400)
    
    except Exception as e:
        print(f"ERROR::",str(e))
        return Response({
            "success":False,
            "message":"An error occured",
            "error":str(e),
            "status":500

        },500)
        



# Wishlist && wishlist_item function based view
    

# @api_view(['GET', 'POST'])
# def wishlist_list(request):
#     if request.method == 'GET':
#         wishlists = Wishlist.objects.all()
#         serializer = WishlistSerializer(wishlists, many=True)
#         return Response(serializer.data)
    
#     elif request.method == 'POST':
#         serializer = WishlistSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

# @api_view(['GET', 'PUT', 'DELETE'])
# def wishlist_detail(request, pk):
#     try:
#         wishlist = Wishlist.objects.get(pk=pk)
#     except Wishlist.DoesNotExist:
#         return Response(status=status.HTTP_404_NOT_FOUND)

#     if request.method == 'GET':
#         serializer = WishlistSerializer(wishlist)
#         return Response(serializer.data)
    
#     elif request.method == 'PUT':
#         serializer = WishlistSerializer(wishlist, data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
#     elif request.method == 'DELETE':
#         wishlist.delete()
#         return Response(status=status.HTTP_204_NO_CONTENT)


# @api_view(['GET', 'POST'])
# def wishlist_items_list(request):
#     if request.method == 'GET':
#         wishlist_items = WishlistItems.objects.all()
#         serializer = WishlistItemsSerializer(wishlist_items, many=True)
#         return Response(serializer.data)
    
#     elif request.method == 'POST':
#         serializer = WishlistItemsSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

# @api_view(['GET', 'PUT', 'DELETE'])
# def wishlist_item_detail(request, pk):
#     try:
#         wishlist_item = WishlistItems.objects.get(pk=pk)
#     except WishlistItems.DoesNotExist:
#         return Response(status=status.HTTP_404_NOT_FOUND)

#     if request.method == 'GET':
#         serializer = WishlistItemsSerializer(wishlist_item)
#         return Response(serializer.data)
    
#     elif request.method == 'PUT':
#         serializer = WishlistItemsSerializer(wishlist_item, data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
#     elif request.method == 'DELETE':
#         wishlist_item.delete()
#         return Response(status=status.HTTP_204_NO_CONTENT)

# Wishlist && wishlist_item function based view

@api_view(['GET', 'POST'])
def wishlist_list_create(request):
    if request.method == 'GET':
        user_id = request.GET.get('user_id')  # Get user_id from query parameters
        if user_id:
            wishlists = Wishlist.objects.filter(user_id=user_id)  # Filter wishlist by user_id
        else:
            wishlists = Wishlist.objects.all()
        serializer = WishlistSerializer(wishlists, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = WishlistSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'POST'])
def wishlist_items_list_create(request):
    if request.method == 'GET':
        wishlist_items = WishlistItems.objects.all()
        serializer = WishlistItemsSerializer(wishlist_items, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        wishlist_id = request.data.get('wishlist_id')
        product_id = request.data.get('product_id')

        # Ensure both wishlist_id and product_id are provided
        if not wishlist_id or not product_id:
            return Response({"error": "Wishlist ID and Product ID are required"}, status=status.HTTP_400_BAD_REQUEST)

        # Check if the product already exists in the wishlist
        existing_item = WishlistItems.objects.filter(wishlist_id=wishlist_id, product_id=product_id).first()
        if existing_item:
            return Response({"error": "Product is already in the wishlist"}, status=status.HTTP_400_BAD_REQUEST)

        # If not already in the wishlist, proceed with saving
        serializer = WishlistItemsSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# View for handling individual wishlist item (GET, PUT, DELETE)
@api_view(['GET', 'PUT', 'DELETE'])
def wishlist_items_detail(request, pk):
    try:
        wishlist_item = WishlistItems.objects.get(pk=pk)
    except WishlistItems.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = WishlistItemsSerializer(wishlist_item)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = WishlistItemsSerializer(wishlist_item, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        wishlist_item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
# cart && caert_item function based view


@api_view(['GET'])
def cart_list(request):
    carts = Cart.objects.all()
    serializer = CartSerializer(carts, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def cart_detail(request, cart_id):
    try:
        cart = Cart.objects.get(cart_id=cart_id)
    except Cart.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    serializer = CartSerializer(cart)
    return Response(serializer.data)
@api_view(['DELETE'])
def clear_cart_items(request):
    user_id = request.query_params.get('user_id')
    if not user_id:
        return Response({'error': 'User ID is required'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        cart = Cart.objects.get(user_id=user_id)
        CartItems.objects.filter(cart_id=cart.cart_id).delete()
        return Response({'message': 'Cart cleared successfully'}, status=status.HTTP_200_OK)
    except Cart.DoesNotExist:
        return Response({'error': 'Cart not found'}, status=status.HTTP_404_NOT_FOUND)


# Payment function based view  

from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.utils import timezone
from .models import Payment, Cart, Order
from .serializers import PaymentSerializer
import razorpay

# Initialize Razorpay client
razorpay_client = razorpay.Client(auth=("rzp_test_yIjQWNT42YCgb7", "Ynez8xNEVxPeFn3DDYV2TgqQ"))

@api_view(['POST'])
def create_payment(request):
    payment_method = request.data.get('payment_method')
    amount = request.data.get('amount')
    cart_id = request.data.get('cart_id')

    try:
        cart = Cart.objects.get(cart_id=cart_id)
    except Cart.DoesNotExist:
        return Response({'error': 'Invalid cart ID'}, status=status.HTTP_400_BAD_REQUEST)
    print("cart", cart)
    print("user id", cart.user_id.id)
    if payment_method == 'cod':
        # Create order entry before saving payment
        order = Order.objects.create(
            user_id=cart.user_id,
            order_status="placed",
            order_date=timezone.now(),
            tax_amount=0,  # Modify as needed
            total_amount=amount
        )

        payment = Payment(
            payment_method='cod',
            amount=amount,
            cart_id=cart,
            is_successful=True,
            order_id=order  # Link to order
        )
        payment.save()

        create_order_items(order, cart_id, cart.user_id.id)

        return Response({'message': 'Order placed successfully with COD', 'order_id': order.order_id}, status=status.HTTP_201_CREATED)

    elif payment_method == 'online':
        # Razorpay order creation
        razorpay_order = razorpay_client.order.create({
            'amount': int(amount * 100),
            'currency': 'INR',
            'payment_capture': 1
        })

        payment = Payment(
            payment_method='online',
            amount=amount,
            cart_id=cart,
            payment_id=razorpay_order['id'],
            is_successful=False
        )
        payment.save()
        return Response({'order_id': razorpay_order['id']}, status=status.HTTP_201_CREATED)


@api_view(['POST'])
def verify_payment(request):
    payment_id = request.data.get('payment_id')
    razorpay_order_id = request.data.get('order_id')

    try:
        payment = Payment.objects.get(payment_id=razorpay_order_id)
        razorpay_payment = razorpay_client.payment.fetch(payment_id)
        if razorpay_payment['status'] == 'captured':
            # Create an order for the successful payment
            order = Order.objects.create(
                user_id=payment.cart_id.user_id,
                order_status="placed",
                order_date=timezone.now(),
                tax_amount=50,
                total_amount=payment.amount
            )

            # Update payment details
            payment.is_successful = True
            payment.payment_id = payment_id  # Save actual Razorpay payment ID
            payment.order_id = order  # Associate the order with payment
            payment.save()

            create_order_items(order, payment.cart_id, payment.cart_id.user_id.id)
            
            return Response({'message': 'Payment verified and order created', 'order_id': order.order_id}, status=status.HTTP_200_OK)

        else:
            return Response({'error': 'Payment not captured. Please try again.'}, status=status.HTTP_400_BAD_REQUEST)

    except Payment.DoesNotExist:
        print("Payment not found")
        return Response({'error': 'Payment not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        print("error",e)
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST) 
    
def create_order_items(order, cart_id, user_id):
    cart_items = CartItems.objects.filter(cart_id=cart_id)
    user = User.objects.get(id=user_id)
    for item in cart_items:
        # Get product and quantity from each cart item
        product = item.product_id
        quantity = item.quantity

        # Calculate price based on product price and quantity
        price = product.price * quantity

        # Create an OrderItem instance
        OrderItems.objects.create(
            user = user,
            order_id=order,
            product_id=product,
            quantity=quantity,
            price=price
        )

    # Clear cart items after order items are created
    cart_items.delete()
    
# @api_view(['GET', 'POST'])
# def payment_list_create(request):
#     if request.method == 'GET':
#         payments = Payment.objects.all()
#         serializer = PaymentSerializer(payments, many=True)
#         return Response(serializer.data)

#     elif request.method == 'POST':
#         serializer = PaymentSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# @api_view(['GET', 'PUT', 'DELETE'])
# def payment_detail(request, pk):
#     try:
#         payment = Payment.objects.get(pk=pk)
#     except Payment.DoesNotExist:
#         return Response(status=status.HTTP_404_NOT_FOUND)

#     if request.method == 'GET':
#         serializer = PaymentSerializer(payment)
#         return Response(serializer.data)

#     elif request.method == 'PUT':
#         serializer = PaymentSerializer(payment, data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#     elif request.method == 'DELETE':
#         payment.delete()
#         return Response(status=status.HTTP_204_NO_CONTENT)  

# @api_view(['POST'])
# def payment_create(request):
#     serializer = PaymentSerializer(data=request.data)
#     if serializer.is_valid():
#         serializer.save()
#         return Response(serializer.data, status=status.HTTP_201_CREATED)
#     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# @api_view(['PUT'])
# def payment_update(request, pk):
#     try:
#         payment = Payment.objects.get(pk=pk)
#     except Payment.DoesNotExist:
#         return Response(status=status.HTTP_404_NOT_FOUND)
    
#     serializer = PaymentSerializer(payment, data=request.data)
#     if serializer.is_valid():
#         serializer.save()
#         return Response(serializer.data)
#     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# @api_view(['DELETE'])
# def payment_delete(request, pk):
#     try:
#         payment = Payment.objects.get(pk=pk)
#     except Payment.DoesNotExist:
#         return Response(status=status.HTTP_404_NOT_FOUND)
    
#     payment.delete()
#     return Response(status=status.HTTP_204_NO_CONTENT)     

# @api_view(['GET', 'POST'])
# def address_list(request):
#     if request.method == 'GET':
#         addresses = Address.objects.all()
#         serializer = AddressSerializer(addresses, many=True)
#         return Response(serializer.data)

#     elif request.method == 'POST':
#         serializer = AddressSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# @api_view(['GET', 'PUT', 'DELETE'])
# def address_detail(request, pk):
#     try:
#         address = Address.objects.get(pk=pk)
#     except Address.DoesNotExist:
#         return Response(status=status.HTTP_404_NOT_FOUND)

#     if request.method == 'GET':
#         serializer = AddressSerializer(address)
#         return Response(serializer.data)

#     elif request.method == 'PUT':
#         serializer = AddressSerializer(address, data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#     elif request.method == 'DELETE':
#         address.delete()
#         return Response(status=status.HTTP_204_NO_CONTENT)
    

#  #  Address function based view   
    
# @api_view(['GET', 'POST'])
# def address_list(request):
#     if request.method == 'GET':
#         addresses = Address.objects.all()
#         serializer = AddressSerializer(addresses, many=True)
#         return Response(serializer.data)

#     elif request.method == 'POST':
#         serializer = AddressSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# @api_view(['GET', 'PUT', 'DELETE'])
# def address_detail(request, pk):
#     try:
#         address = Address.objects.get(pk=pk)
#     except Address.DoesNotExist:
#         return Response(status=status.HTTP_404_NOT_FOUND)

#     if request.method == 'GET':
#         serializer = AddressSerializer(address)
#         return Response(serializer.data)

#     elif request.method == 'PUT':
#         serializer = AddressSerializer(address, data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#     elif request.method == 'DELETE':
#         address.delete()
#         return Response(status=status.HTTP_204_NO_CONTENT)
    

# @api_view(['POST'])
# def create_address(request):
#     if request.method == 'POST':
#         serializer = AddressSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# @api_view(['PUT'])
# def update_address(request, pk):
#     try:
#         address = Address.objects.get(pk=pk)
#     except Address.DoesNotExist:
#         return Response(status=status.HTTP_404_NOT_FOUND)

#     if request.method == 'PUT':
#         serializer = AddressSerializer(address, data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# @api_view(['DELETE'])
# def delete_address(request, pk):
#     try:
#         address = Address.objects.get(pk=pk)
#     except Address.DoesNotExist:
#         return Response(status=status.HTTP_404_NOT_FOUND)

#     if request.method == 'DELETE':
#         address.delete()
#         return Response(status=status.HTTP_204_NO_CONTENT)
@api_view(['GET', 'POST'])
def address_list(request):
    if request.method == 'GET':
        addresses = Address.objects.all()
        serializer = AddressSerializer(addresses, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = AddressSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def address_detail(request, pk):
    try:
        address = Address.objects.get(pk=pk)
    except Address.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = AddressSerializer(address)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = AddressSerializer(address, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        address.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    

@api_view(['POST'])
def create_address(request):
    if request.method == 'POST':
        serializer = AddressSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
def update_address(request, pk):
    try:
        address = Address.objects.get(pk=pk)
    except Address.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'PUT':
        serializer = AddressSerializer(address, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
def delete_address(request, pk):
    try:
        address = Address.objects.get(pk=pk)
    except Address.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'DELETE':
        address.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

#  Shipping function based view   
    
@api_view(['GET', 'POST'])
def shipping_list(request):
    if request.method == 'GET':
        shippings = Shipping.objects.all()
        serializer = ShippingSerializer(shippings, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = ShippingSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def shipping_detail(request, pk):
    try:
        shipping = Shipping.objects.get(pk=pk)
    except Shipping.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = ShippingSerializer(shipping)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = ShippingSerializer(shipping, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        shipping.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    

@api_view(['POST'])
def shipping_create(request):
    serializer = ShippingSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
def shipping_update(request, pk):
    try:
        shipping = Shipping.objects.get(pk=pk)
    except Shipping.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    serializer = ShippingSerializer(shipping, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
def shipping_delete(request, pk):
    try:
        shipping = Shipping.objects.get(pk=pk)
    except Shipping.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    shipping.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)
       
@api_view(['GET', 'POST'])
def cart_list_view(request):
    if request.method == 'GET':
        user_id = request.query_params.get('user_id')
        if user_id:
            carts = Cart.objects.filter(user_id=user_id)
        else:
            carts = Cart.objects.all()

        serializer = CartSerializer(carts, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = CartSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# View for getting cart items
@api_view(['GET'])
def cart_items_list_view(request):
    user_id = request.query_params.get('user_id')

    if not user_id:
        return Response({'error': 'User ID is required'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        cart = Cart.objects.get(user_id=user_id)
    except Cart.DoesNotExist:
        return Response({'error': 'Cart not found'}, status=status.HTTP_404_NOT_FOUND)

    cart_items = CartItems.objects.filter(cart_id=cart.cart_id)
    serializer = CartItemsSerializer(cart_items, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET', 'PUT', 'DELETE'])
def cart_detail(request, pk):
    try:
        cart = Cart.objects.get(pk=pk)
    except Cart.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = CartSerializer(cart)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = CartSerializer(cart, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        cart.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)



@api_view(['POST'])
def cart_items_list_create(request):
    print("Incoming request data:", request.data)
    user_id = request.data.get('user_id')
    product_id = request.data.get('product_id')
    product_id = int(request.data.get('product_id'))
    quantity = request.data.get('quantity', 1)  # Default quantity to 1 if not provided

    # Check for missing fields
    if not user_id:
        return Response({'error': 'User ID is required'}, status=status.HTTP_400_BAD_REQUEST)
    if not product_id:
        return Response({'error': 'Product ID is required'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Get the user's cart
        cart = Cart.objects.get(user_id=user_id)
    except Cart.DoesNotExist:
        return Response({'error': 'Cart not found'}, status=status.HTTP_404_NOT_FOUND)

    try:
        # Validate if the product exists before adding to cart
        product = Product.objects.get(product_id=product_id)  # Ensure the product exists
    except Product.DoesNotExist:
        return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)

    # Check if the product is already in the cart
    cart_item, created = CartItems.objects.get_or_create(
        cart_id=cart,  # Use cart instance directly for cart_id field
        product_id=product,  # Use the product instance here
        defaults={'quantity': quantity}
    )

    if not created:
        # If the product already exists in the cart, update the quantity
        cart_item.quantity += int(quantity)
        cart_item.save()

    serializer = CartItemsSerializer(cart_item)
    return Response(serializer.data, status=status.HTTP_201_CREATED)
  
@api_view(['GET', 'PUT', 'DELETE', 'PATCH'])  # Add PATCH here
def cart_items_detail(request, pk):
    try:
        cart_item = CartItems.objects.get(pk=pk)
    except CartItems.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = CartItemsSerializer(cart_item)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = CartItemsSerializer(cart_item, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'PATCH':  # Handle PATCH for partial updates
        serializer = CartItemsSerializer(cart_item, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        cart_item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['POST'])
def disable_enable_order(request,pk):
    try:
        order = Order.objects.get(pk=pk)
        if order.is_active == True:
            order.is_active  = False
        else:
            order.is_active = True
        order.save()
        return Response({'message':f"order active status changed to : {order.is_active} "},status=status.HTTP_200_OK)
    except Product.DoesNotExist:
        print(f"ERROR: order for this id doesnot exist!")
        return Response({'message': f"No order found for the given id {pk}"},status=status.HTTP_204_NO_CONTENT)
    except Exception as e:
        print(f"ERROR: {e}")
        return Response({'message': f"An error occurred while processing your request"},status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# ORDERS PER DAY


@api_view(['GET'])
def orders_per_day(request):
    try:
        days_param = request.query_params.get('days', 7)
        try:
            days = int(days_param)
            if days <= 0:
                raise ValueError("Days parameter must be a positive integer.")
        except ValueError as e:
            return Response(
                {"error": str(e), "message": "Invalid 'days' parameter."},
                status=status.HTTP_400_BAD_REQUEST
            )

        end_date = now()
        start_date = end_date - timedelta(days=days)

        orders = (
            Order.objects.filter(order_date__range=(start_date, end_date))
            .extra(select={'date': "DATE(order_date)"})
            .values('date')
            .annotate(order_count=Count('order_id'))  # Use 'order_id' instead of 'id'
            .order_by('date')
        )

        result = [{'date': entry['date'], 'order_count': entry['order_count']} for entry in orders]
        return Response(result, status=status.HTTP_200_OK)

    except Exception as e:
        return Response(
            {"error": "An unexpected error occurred.", "details": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    

@api_view(['GET'])
def category_orders_by_day(request):
    try:
        try:
            days = int(request.GET.get('days', 7))
            if days <= 0:
                return Response(
                    {"error": "Days must be a positive integer"},
                    status=status.HTTP_400_BAD_REQUEST
                )
        except ValueError:
            return Response(
                {"error": "Invalid days parameter. Must be an integer"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        start_date = timezone.now().date() - timedelta(days=days)
        
        category_order_counts = (
            OrderItems.objects
            .filter(
                created_at__date__gte=start_date,
                is_active=True
            )
            .values('product_id__category__name')
            .annotate(order_count=Count('order_item_id', distinct=True))
        )
        
        if not category_order_counts:
            return Response(
                {"message": "No order data found for the specified period"},
                status=status.HTTP_404_NOT_FOUND
            )
        
        total_orders = sum(item['order_count'] for item in category_order_counts)
        
        # Generate dynamic colors based on number of categories
        dynamic_colors = generate_dynamic_colors(len(category_order_counts)) 
        
        chart_data = {
            'labels': [],
            'datasets': [{
                'data': [],
                'backgroundColor': dynamic_colors,
                'borderWidth': 1,
                'borderColor': '#fff'
            }],
            'formatted_labels': []      
        }
        
        for index, item in enumerate(category_order_counts):
            category_name = item['product_id__category__name']
            order_count = item['order_count']
            percentage = (order_count / total_orders) * 100
            
            chart_data['labels'].append(category_name)
            chart_data['datasets'][0]['data'].append(order_count)
            chart_data['formatted_labels'].append(
                f"{category_name}: {percentage:.1f}%"  
            )
        
        return Response(chart_data)
    
    except Exception as e:
        print(str(e))
        
        return Response(
            {"error": f"An unexpected error occurred: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
def product_orders_by_day(request):
    try:
        try:
            days = int(request.GET.get('days', 7))
            if days <= 0:
                return Response(
                    {"error": "Days must be a positive integer"},
                    status=status.HTTP_400_BAD_REQUEST
                )
        except ValueError:
            return Response(
                {"error": "Invalid days parameter. Must be an integer"},
                status=status.HTTP_400_BAD_REQUEST
            )

        start_date = timezone.now().date() - timedelta(days=days)

        product_order_counts = (
            OrderItems.objects
            .filter(
                created_at__date__gte=start_date,
                is_active=True
            )
            .values('product_id__name')
            .annotate(order_count=Count('order_item_id', distinct=True))
        )

        if not product_order_counts:
            return Response(
                {"message": "No order data found for the specified period"},
                status=status.HTTP_404_NOT_FOUND
            )

        total_orders = sum(item['order_count'] for item in product_order_counts)

        # Generate dynamic colors based on number of products
        dynamic_colors = generate_dynamic_colors(len(product_order_counts))

        chart_data = {
            'labels': [],
            'datasets': [{
                'data': [],
                'backgroundColor': dynamic_colors,
                'borderWidth': 1,
                'borderColor': '#fff'
            }],
            'formatted_labels': []
        }

        for index, item in enumerate(product_order_counts):
            product_name = item['product_id__name']
            order_count = item['order_count']
            percentage = (order_count / total_orders) * 100

            chart_data['labels'].append(product_name)
            chart_data['datasets'][0]['data'].append(order_count)
            chart_data['formatted_labels'].append(
                f"{product_name}: {percentage:.1f}%"
            )

        return Response(chart_data)

    except Exception as e:
        print(str(e))
        return Response(
            {"error": f"An unexpected error occurred: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
