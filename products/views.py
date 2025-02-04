from django.shortcuts import render
from rest_framework.decorators import api_view, parser_classes
from rest_framework.response import Response
from rest_framework import status

from authentication.models import User
from orders.models import Order, OrderItems
from .models import Product,Category,MadeOf,Country,Brand, Review, SentimentAnalysis, WineEvent, FoodPairing, WineRecommendation
from .serializers import GetReviewSerializer, ProductSerializer,CategorySerializer,MadeOfSerializer,CountrySerializer,BrandSerializer, ReviewSerializer, WineEventSerializer, FoodPairingSerializer, WineRecommendationSerializer
from django.db.models import Q
from django.http import JsonResponse
from textblob import TextBlob
from django.db.models import Avg, Count

from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import Q
from rest_framework import status
from .models import Product
from .serializers import ProductSerializer

from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.shortcuts import get_object_or_404
from .models import Product, Category, Brand
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger

import cv2
from PIL import Image
from sklearn.metrics.pairwise import cosine_similarity
import io
from rest_framework.parsers import MultiPartParser, FormParser
import numpy as np
import os
import pytesseract
from Levenshtein import ratio
import re

from rest_framework.views import APIView
import pandas as pd
from django.db.models import Q
from django.core.files.storage import default_storage
from django.core.files import File
import os
import requests
from urllib.parse import urlparse
from django.core.files.temp import NamedTemporaryFile

@api_view(['GET'])
def product_filter(request):
    category = request.query_params.get('category')
    brand = request.query_params.get('brand')
    country = request.query_params.get('country')
    made_of = request.query_params.get('made_of')
    sort = request.query_params.get('sort')
# Building filters based on query parameters
    filters = Q()
    if category and category.strip().lower() != 'all':
        filters &= Q(category__name=category.strip())
    if brand and brand.strip().lower() != 'all':
        filters &= Q(brand__name=brand.strip())
    if country and country.strip().lower() != 'all':
        filters &= Q(country__name=country.strip())
    if made_of and made_of.strip().lower() != 'all':
        filters &= Q(made_of__name=made_of.strip())

    # Applying the filters
    products = Product.objects.filter(filters).filter(approved=True, is_active=True)
    # Sorting logic
    if sort == 'price-asc':
        products = products.order_by('price')
    elif sort == 'price-desc':
        products = products.order_by('-price')
    elif sort == 'rating':  # Assuming the Product model has a 'rating' field
        products = products.order_by('-rating')
    else:
        products = products.order_by('-created_at')  # Default sorting by newest

    # Serialize and return the products
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

from django.db.models import Q

@api_view(['GET'])
def list_products(request):
    # Get the search query parameter
    search_query = request.GET.get('search', '')

    products = Product.objects.filter(approved=True)
    if search_query:
        products = products.filter(
            Q(name__icontains=search_query) | 
            Q(description__icontains=search_query)
        )

    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)  

@api_view(['GET'])
def list_notapproved_products(request):
    products = Product.objects.filter(approved=False)
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)

def search_products(request):
    query = request.GET.get('q', '')
    products = Product.objects.filter(name__icontains=query)  # Filter by product name
    results = [{'id': product.id, 'name': product.name, 'price': product.price} for product in products]
    return JsonResponse(results, safe=False)

@api_view(['POST'])
def create_product(request):
    if request.method == 'POST':
        serializer = ProductSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT', 'PATCH'])
def update_product(request, pk):
    try:
        product = Product.objects.get(pk=pk)
    except Product.DoesNotExist:
        return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)

    data = request.data.copy()

    image_data = data.get('image')
    if image_data == '' or image_data is None:
        data.pop('image', None)

    serializer = ProductSerializer(product, data=data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    
# @api_view(['GET'])
# def list_products(request):
#     if request.method == 'GET':
#         products = Product.objects.all()
#         serializer = ProductSerializer(products, many=True)
#         return Response(serializer.data)    

@api_view(['GET'])
def product_details(request, pk):
    try:
        product = Product.objects.get(pk=pk)
    except Product.DoesNotExist:
        return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = ProductSerializer(product)
        return Response(serializer.data)
    
@api_view(['DELETE'])
def delete_product(request, pk):
    try:
        product = Product.objects.get(pk=pk)
    except Product.DoesNotExist:
        return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'DELETE':
        product.delete()
        return Response({'message': 'Product deleted successfully'}, status=status.HTTP_200_OK)    

@api_view(['POST'])
def disable_enable_product(request,pk):
    try:
        product = Product.objects.get(pk=pk)
        if product.is_active == True:
            product.is_active  = False
        else:
            product.is_active = True
        product.save()
        return Response({'message':f"Product active status changed to : {product.is_active} "},status=status.HTTP_200_OK)
    except Product.DoesNotExist:
        print(f"ERROR: Product for this id doesnot exist!")
        return Response({'message': f"No Product found for the given id {pk}"},status=status.HTTP_204_NO_CONTENT)
    except Exception as e:
        print(f"ERROR: {e}")
        return Response({'message': f"An error occurred while processing your request"},status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# category function based views

@api_view(['GET'])
def category_list(request):
    categories = Category.objects.all()
    serializer = CategorySerializer(categories, many=True)
    return Response(serializer.data)


@api_view(['POST'])
def category_create(request):
    name = request.data.get('name')
    
    # Check if a category with the same name already exists
    if Category.objects.filter(name=name).exists():
        return Response(
            {"error": "A category with this name already exists."},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Proceed with creating the category
    serializer = CategorySerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def category_detail(request, pk):
    try:
        category = Category.objects.get(pk=pk)
    except Category.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    serializer = CategorySerializer(category)
    return Response(serializer.data)

@api_view(['PUT'])
def category_update(request, pk):
    try:
        category = Category.objects.get(pk=pk)
    except Category.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    serializer = CategorySerializer(category, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def category_delete(request, pk):
    try:
        category = Category.objects.get(pk=pk)
        category.delete()
        return Response({'message':'category deleted'},status=status.HTTP_200_OK)
    except Category.DoesNotExist:
        return Response({'error':"Item with this id does not exist"},status=status.HTTP_204_NO_CONTENT)


@api_view(['POST'])
def disable_enable_category(request,pk):
    try:
        category = Category.objects.get(pk=pk)
        if category.is_active == True:
            category.is_active  = False
        else:
            category.is_active = True
        category.save()
        return Response({'message':f"Category active status changed to : {category.is_active} "},status=status.HTTP_200_OK)
    except Product.DoesNotExist:
        print(f"ERROR: Brand for this id doesnot exist!")
        return Response({'message': f"No Category found for the given id {pk}"},status=status.HTTP_204_NO_CONTENT)
    except Exception as e:
        print(f"ERROR: {e}")
        return Response({'message': f"An error occurred while processing your request"},status=status.HTTP_500_INTERNAL_SERVER_ERROR)

 
    
   
    

# madeOf function based views

@api_view(['GET', 'POST'])
def madeof_list(request):
    if request.method == 'GET':
        madeofs = MadeOf.objects.all()
        serializer = MadeOfSerializer(madeofs, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = MadeOfSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def madeof_create(request):
    serializer = MadeOfSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
def madeof_detail(request, madeof_id):
    try:
        madeof = MadeOf.objects.get(pk=madeof_id)
    except MadeOf.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = MadeOfSerializer(madeof)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = MadeOfSerializer(madeof, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        madeof.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['PUT'])
def madeof_update(request, madeof_id):
    try:
        madeof = MadeOf.objects.get(pk=madeof_id)
    except MadeOf.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    serializer = MadeOfSerializer(madeof, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def madeof_delete(request, madeof_id):
    try:
        madeof = MadeOf.objects.get(pk=madeof_id)
        madeof.delete()
        return Response({'message':"Item deleted"},status=status.HTTP_200_OK)
    except MadeOf.DoesNotExist:
        return Response({'error':"Item with this id does not exist"},status=status.HTTP_204_NO_CONTENT)


@api_view(['POST'])
def disable_enable_madeof(request,pk):
    try:
        madeof = MadeOf.objects.get(pk=pk)
        if madeof.is_active == True:
            madeof.is_active  = False
        else:
            madeof.is_active = True
        madeof.save()
        return Response({'message':f"madeof active status changed to : {madeof.is_active} "},status=status.HTTP_200_OK)
    except Product.DoesNotExist:
        print(f"ERROR: Brand for this id doesnot exist!")
        return Response({'message': f"No madeof found for the given id {pk}"},status=status.HTTP_204_NO_CONTENT)
    except Exception as e:
        print(f"ERROR: {e}")
        return Response({'message': f"An error occurred while processing your request"},status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    


# country function based views
    
@api_view(['GET', 'POST'])
def country_list(request):
    if request.method == 'GET':
        countries = Country.objects.all()
        serializer = CountrySerializer(countries, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = CountrySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['POST'])
def country_create(request):
    if request.method == 'POST':
        serializer = CountrySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

@api_view(['GET', 'PUT', 'DELETE'])
def country_detail(request, country_id):
    try:
        country = Country.objects.get(pk=country_id)
    except Country.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = CountrySerializer(country)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = CountrySerializer(country, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        country.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)    
    

@api_view(['PUT'])
def country_update(request, pk):
    try:
        country = Country.objects.get(pk=pk)
    except Country.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    serializer = CountrySerializer(country, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
def country_delete(request, pk):
    try:
        country = Country.objects.get(pk=pk)
        country.delete()
        return Response({'message':"Country deleted"},status=status.HTTP_200_OK)
    except Country.DoesNotExist:
        return Response({'error':"Item with this id does not exist"},status=status.HTTP_204_NO_CONTENT)



@api_view(['POST'])
def disable_enable_country(request,pk):
    try:
        country = Country.objects.get(pk=pk)
        if country.is_active == True:
            country.is_active  = False
        else:
            country.is_active = True
        country.save()
        return Response({'message':f"country active status changed to : {country.is_active} "},status=status.HTTP_200_OK)
    except Product.DoesNotExist:
        print(f"ERROR: Brand for this id doesnot exist!")
        return Response({'message': f"No country found for the given id {pk}"},status=status.HTTP_204_NO_CONTENT)
    except Exception as e:
        print(f"ERROR: {e}")
        return Response({'message': f"An error occurred while processing your request"},status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    


# Brands function based views   


@api_view(['GET', 'POST'])
def brand_list(request):
    if request.method == 'GET':
        brands = Brand.objects.all()
        serializer = BrandSerializer(brands, many=True)
        return Response(serializer.data)

    if request.method == 'POST':
        serializer = BrandSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

@api_view(['POST'])
def brand_create(request):
    if request.method == 'POST':
        serializer = BrandSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

@api_view(['GET', 'PUT', 'DELETE'])
def brand_detail(request, pk):
    try:
        brand = Brand.objects.get(pk=pk)
    except Brand.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = BrandSerializer(brand)
        return Response(serializer.data)

    if request.method == 'PUT':
        serializer = BrandSerializer(brand, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    if request.method == 'DELETE':
        brand.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['PUT'])
def brand_update(request, pk):
    try:
        brand = Brand.objects.get(pk=pk)
    except Brand.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'PUT':
        serializer = BrandSerializer(brand, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def brand_delete(request, pk):
    try:
        brand = Brand.objects.get(pk=pk)
        brand.delete()
        return Response({'message':"Brand deleted"},status=status.HTTP_200_OK)
    except Brand.DoesNotExist:
        return Response({'error':"Item with this id does not exist"},status=status.HTTP_204_NO_CONTENT)



@api_view(['POST'])
def disable_enable_brand(request,pk):
    try:
        brand = Brand.objects.get(pk=pk)
        if brand.is_active == True:
            brand.is_active  = False
        else:
            brand.is_active = True
        brand.save()
        return Response({'message':f"Brand active status changed to : {brand.is_active} "},status=status.HTTP_200_OK)
    except Product.DoesNotExist:
        print(f"ERROR: Brand for this id doesnot exist!")
        return Response({'message': f"No Brand found for the given id {pk}"},status=status.HTTP_204_NO_CONTENT)
    except Exception as e:
        print(f"ERROR: {e}")
        return Response({'message': f"An error occurred while processing your request"},status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def product_search(request):
    # Get query parameters
    product_name = request.query_params.get('product_name', None)
    brand_name = request.query_params.get('brand_name', None)

    # Create filter conditions using Q objects
    filters = Q(is_active=True)
    if product_name:
        filters &= Q(name__icontains=product_name)
    if brand_name:
        filters &= Q(brand__name__icontains=brand_name)

    # Query the Product model
    products = Product.objects.filter(filters).distinct()
    serializer = ProductSerializer(products, many=True)

    return Response(serializer.data, status=status.HTTP_200_OK)


def analyze_sentiment(comment):
    blob = TextBlob(comment)
    polarity = blob.sentiment.polarity
    if polarity > 0:
        return "Positive", polarity
    elif polarity < 0:
        return "Negative", polarity
    else:
        return "Neutral", polarity

@api_view(['POST'])
# @permission_classes([IsAuthenticated])
def create_review(request):
    try:
        product_id = request.data['product_id']
        user_email = request.data['user_email']
        order_id = request.data['order_id']
        product = Product.objects.get(product_id=product_id)
        user = User.objects.get(email=user_email)

        # Check if the user purchased the product
        if not OrderItems.objects.filter(user=user, product_id=product).exists():
            return Response({
                "success":"False",
                "message": "You have not purchased this product",
                "error":"You must have purchased the product to leave a review.",
                "status":status.HTTP_400_BAD_REQUEST
                }, status=status.HTTP_400_BAD_REQUEST)
            

        # Serialize and save review
        serializer = ReviewSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=user, product=product)
            review = serializer.instance

            # Perform sentiment analysis
            sentiment, score = analyze_sentiment(review.comment)
            SentimentAnalysis.objects.create(review=review, sentiment=sentiment, score=score)
            return Response({
                "success": "True",
                "message": "Review created successfully",
                "data":serializer.data,
                "status": status.HTTP_201_CREATED,
            })

        return Response({
            "success": "False",
            "message": "Invalid data",
            "error": serializer.errors,
            "status": status.HTTP_400_BAD_REQUEST
        })
    except Product.DoesNotExist:
        return Response({
            "success": "False",
            "message": "Product not found",
            "error": "Product does not exist",
            "status": status.HTTP_404_NOT_FOUND
        })

@api_view(['POST'])
def add_additional_review(request):
    if request.method == 'POST':
        try:
            product_id = request.data['product_id']
            user_email = request.data['user_email']
            order_id = request.data['order_id']
            product = Product.objects.get(product_id=product_id)
            user = User.objects.get(email=user_email)

        except Exception as e:
            print(str(e))

            

@api_view(['PUT'])
def edit_review(request, review_id, user_id):
    try:
        # Fetch the user and order items to validate
        user = User.objects.get(id=user_id)
        # order_item = OrderItems.objects.filter(order_id=order_id, user=user).first()

        # if not order_item:
        #     return Response({
        #         "success": "False",
        #         "message": "Order not found or does not belong to the user",
        #         "error": "Invalid order or user",
        #         "status": status.HTTP_404_NOT_FOUND
        #     }, status=status.HTTP_404_NOT_FOUND)

        # Fetch the review associated with the order and user
        review = Review.objects.filter(id=review_id, user=user).first()
        if not review:
            return Response({
                "success": "False",
                "message": "Review not found",
                "error": "No review exists for this order and user",
                "status": status.HTTP_404_NOT_FOUND
            }, status=status.HTTP_404_NOT_FOUND)

        # Update the review
        serializer = ReviewSerializer(review, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({
                "success": "True",
                "message": "Review updated successfully",
                "data": serializer.data,
                "status": status.HTTP_200_OK
            })

        return Response({
            "success": "False",
            "message": "Invalid data",
            "error": serializer.errors,
            "status": status.HTTP_400_BAD_REQUEST
        })

    except User.DoesNotExist:
        return Response({
            "success": "False",
            "message": "User not found",
            "error": "User does not exist",
            "status": status.HTTP_404_NOT_FOUND
        }, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
def list_reviews(request, product_id):
    try:
        reviews = Review.objects.filter(product_id=product_id)
        serializer = GetReviewSerializer(reviews, many=True)
        return Response({
            "success": "True",
            "message": "Reviews listed successfully",
            "data": serializer.data,
            "status": status.HTTP_200_OK
        })
    except Product.DoesNotExist:
        return Response({
            "success": "False",
            "message": "Product not found",
            "error": "Product does not exist",
            "status": status.HTTP_404_NOT_FOUND 
        })
    


@api_view(['GET'])
def product_review_sentiment_summary(request, product_id):
    try:
        average_rating = Review.objects.filter(product_id=product_id).aggregate(Avg('rating'))['rating__avg']
        sentiments = SentimentAnalysis.objects.filter(review__product_id=product_id)
        total_sentiments = sentiments.count()

        sentiment_summary = sentiments.values('sentiment').annotate(count=Count('sentiment'))
        average_score = sentiments.aggregate(Avg('score'))['score__avg']

        sentiment_percentage = {
            sentiment['sentiment']: f"{round((sentiment['count'] / total_sentiments) * 100, 2)}%"
            for sentiment in sentiment_summary
        } if total_sentiments > 0 else {}

        response_data = {
            "product_id":product_id,
            "average_rating": round(average_rating, 2) if average_rating else 0,
            "average_score": round(average_score, 2) if average_score else 0,
            "sentiment_summary":sentiment_percentage
        }
        return Response({
            "success": "True",
            "message": "Product review sentiment summary listed successfully",
            "data": response_data,
            "status": status.HTTP_200_OK
        })
    except Exception as e:
        return Response({
            "success": "False",
            "message": "An error occurred",
            "error": str(e),
            "status": status.HTTP_500_INTERNAL_SERVER_ERROR
        })
    
@api_view(['GET'])
def user_review_sentiment_summary(request, order_id):
    try:
        average_rating = Review.objects.filter(order_id=order_id).aggregate(Avg('rating'))['rating__avg']
        sentiments = SentimentAnalysis.objects.filter(review__order_id=order_id)
        total_sentiments = sentiments.count()

        sentiment_summary = sentiments.values('sentiment').annotate(count=Count('sentiment'))
        average_score = sentiments.aggregate(Avg('score'))['score__avg']

        sentiment_percentage = {
            sentiment['sentiment']: f"{round((sentiment['count'] / total_sentiments) * 100, 2)}%"
            for sentiment in sentiment_summary
        } if total_sentiments > 0 else {}

        response_data = {
            "order_id": order_id,
            "average_rating": round(average_rating, 2) if average_rating else 0,
            "average_score": round(average_score, 2) if average_score else 0,
            "sentiment_summary": sentiment_percentage
        }
        return Response({
            "success": "True",
            "message": "User review sentiment summary listed successfully",
            "data": response_data,
            "status": status.HTTP_200_OK
        })
    except Exception as e:
        return Response({
            "success": "False",
            "message": "An error occurred",
            "error": str(e),
            "status": status.HTTP_500_INTERNAL_SERVER_ERROR
        })


@api_view(['GET'])
def list_reviews_by_user(request, user_id):
    try:
        reviews = Review.objects.filter(user_id=user_id)
        serializer = GetReviewSerializer(reviews, many=True)
        return Response({
            "success": "True",
            "message": "Reviews listed successfully",
            "data": serializer.data,
            "status": status.HTTP_200_OK
        })
    except Review.DoesNotExist:
        return Response({
            "success": "False",
            "message": "User not found",
            "error": "User does not exist",
            "status": status.HTTP_404_NOT_FOUND 
        })

@api_view(["GET"])
def get_similar_products(request):
    try:
        category_id = request.GET.get('category', None)
        brand_id = request.GET.get('brand', None)
        product_id = request.GET.get('product', None)
        page = request.GET.get('page', 1)
        per_page = request.GET.get('per_page', 10)

        if not category_id and not brand_id:
            return JsonResponse({
                'error': 'Provide either category or brand parameter'
            }, status=400)

        # Base query excluding the current product
        base_query = Product.objects.filter(is_active=True)
        if product_id:
            base_query = base_query.exclude(product_id=product_id)

        # Filter by category
        if category_id:
            category = get_object_or_404(Category, pk=category_id)
            category_products = base_query.filter(category=category)
        else:
            category_products = Product.objects.none()

        # Filter by brand
        if brand_id:
            brand = get_object_or_404(Brand, pk=brand_id)
            brand_products = base_query.filter(brand=brand)
        else:
            brand_products = Product.objects.none()

        # Combine products, removing duplicates
        all_products = list(set(category_products) | set(brand_products))
        all_products.sort(key=lambda x: x.created_at, reverse=True)

        # Pagination
        paginator = Paginator(all_products, per_page)
        
        try:
            paginated_products = paginator.page(page)
        except (PageNotAnInteger, EmptyPage):
            paginated_products = paginator.page(1)

        # Serialize products
        product_list = [{
            'product_id': product.product_id,
            'name': product.name,
            'description': product.description,
            'price': product.price,
            'stock_quantity': product.stock_quantity,
            'image': product.image.url if product.image else None,
            'brand': product.brand.name,
            'category': product.category.name
        } for product in paginated_products]

        return JsonResponse({
            'products': product_list,
            'total_products': len(all_products),
            'total_pages': paginator.num_pages,
            'current_page': paginated_products.number
        })

    except (Category.DoesNotExist, Brand.DoesNotExist):
        return JsonResponse({
            'error': 'Invalid category or brand'
        }, status=404)

    except Exception as e:
        return JsonResponse({
            'error': str(e)
        }, status=500)
    

@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def search_by_image(request):
    try:
        if 'image' not in request.FILES:
            return Response({
                'error': 'No image file provided'
            }, status=status.HTTP_400_BAD_REQUEST)

        uploaded_image = request.FILES['image']
        
        try:
            # Convert uploaded image to OpenCV format
            image_bytes = np.frombuffer(uploaded_image.read(), np.uint8)
            img = cv2.imdecode(image_bytes, cv2.IMREAD_COLOR)
            
            # Wine label specific preprocessing pipeline
            # 1. Resize while maintaining aspect ratio
            target_width = 1200  # Optimal size for wine label text
            aspect_ratio = img.shape[1] / img.shape[0]
            target_height = int(target_width / aspect_ratio)
            img = cv2.resize(img, (target_width, target_height), interpolation=cv2.INTER_CUBIC)

            # 2. Create multiple processing channels
            processed_images = []
            
            # Channel 1: Enhanced contrast grayscale
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            clahe = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8,8))
            contrast_enhanced = clahe.apply(gray)
            processed_images.append(contrast_enhanced)
            
            # Channel 2: Color-based text extraction (for dark text)
            hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
            # Adjust saturation to make text more prominent
            hsv[:,:,1] = cv2.multiply(hsv[:,:,1], 1.5)
            # Convert back to BGR and then to grayscale
            enhanced_color = cv2.cvtColor(hsv, cv2.COLOR_HSV2BGR)
            enhanced_gray = cv2.cvtColor(enhanced_color, cv2.COLOR_BGR2GRAY)
            processed_images.append(enhanced_gray)
            
            # Channel 3: Edge-enhanced
            edges = cv2.Canny(gray, 100, 200)
            kernel = np.ones((2,2), np.uint8)
            dilated_edges = cv2.dilate(edges, kernel, iterations=1)
            processed_images.append(255 - dilated_edges)  # Invert for OCR

            # Configure Tesseract for wine label text
            custom_config = r'''--oem 3 
                              --psm 11
                              -c tessedit_char_whitelist=ABCDEFGHIJKLMNOPQRSTUVWXYZ&
                              -c tessedit_do_invert=0
                              -c textord_heavy_nr=1
                              -c textord_min_linesize=3
                              -c segment_penalty_dict_case=0.5
                              -c segment_penalty_garbage=1.0
                              -c language_model_penalty_case=0.5
                              -c language_model_penalty_font=0.5
                              -c language_model_penalty_spacing=0.05
                              -c tessedit_pageseg_mode=11'''
            
            all_text = []
            
            # Process each channel
            for processed_img in processed_images:
                # Apply threshold to create binary image
                _, binary = cv2.threshold(processed_img, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
                
                # Try different threshold values
                thresholds = [
                    cv2.threshold(processed_img, 127, 255, cv2.THRESH_BINARY)[1],
                    cv2.adaptiveThreshold(processed_img, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2),
                    binary
                ]
                
                for thresh in thresholds:
                    text = pytesseract.image_to_string(thresh, config=custom_config)
                    if text.strip():
                        all_text.append(text.strip())
            
            # Combine and clean results
            extracted_text = ' '.join(all_text)
            
            # Enhanced text cleaning for wine labels
            # Remove special characters but keep '&'
            cleaned_text = re.sub(r'[^A-Z&\s]', '', extracted_text.upper())
            # Normalize spaces
            cleaned_text = ' '.join(cleaned_text.split())
            # Remove very short words except '&'
            words = [word for word in cleaned_text.split() if len(word) > 1 or word == '&']
            cleaned_text = ' '.join(words)
            
            print(f"Extracted text: {cleaned_text}")  # Debug print
            
            # If no text was extracted, try OCR on the original image
            if not cleaned_text:
                original_text = pytesseract.image_to_string(img, config=custom_config)
                cleaned_text = re.sub(r'[^A-Z&\s]', '', original_text.upper())
                cleaned_text = ' '.join(cleaned_text.split())
                print(f"Fallback extracted text: {cleaned_text}")

            # Product search logic
            if cleaned_text:
                words = cleaned_text.split()
                q_objects = Q()
                
                # Add exact phrase match
                q_objects |= Q(name__icontains=cleaned_text)
                
                # Add individual word matches
                for word in words:
                    if len(word) > 1 or word == '&':
                        q_objects |= Q(name__icontains=word)
                
                products = Product.objects.filter(q_objects).distinct()[:6]
            else:
                # Fallback: return empty list if no text extracted
                products = Product.objects.none()
            
            serializer = ProductSerializer(products, many=True)
            
            return Response({
                'success': True,
                'extracted_text': cleaned_text,
                'products': serializer.data
            }, status=status.HTTP_200_OK)

        except Exception as e:
            print(f"Error processing image: {str(e)}")
            return Response({
                'error': f'Error processing image: {str(e)}'
            }, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        print(f"Server error: {str(e)}")
        return Response({
            'error': f'Internal server error: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

##################################################
#### Stock manager API for update stock from excel
##################################################
    

class ProductExcelImportView(APIView):
    def get_or_create_related(self, model_class, name):
        # Case-insensitive search
        obj = model_class.objects.filter(name__iexact=name).first()
        if not obj:
            obj = model_class.objects.create(
                name=name,
                description=f"Auto-created from Excel import for {name}"
            )
        return obj

    def handle_image_url(self, image_url):
        """
        Handle both remote URLs and local file paths for images
        Returns the path where the image is saved or None if failed
        """
        if not image_url or pd.isna(image_url):
            return None

        try:
            # Parse the URL to get the filename
            parsed_url = urlparse(image_url)
            image_name = os.path.basename(parsed_url.path)

            # If it's a URL (starts with http or https)
            if image_url.startswith(('http://', 'https://')):
                # Download the image
                response = requests.get(image_url, stream=True)
                if response.status_code == 200:
                    # Create a temporary file
                    img_temp = NamedTemporaryFile(delete=True)
                    img_temp.write(response.content)
                    img_temp.flush()

                    # Save to default storage (your media folder)
                    path = default_storage.save(
                        f'product_images/{image_name}',
                        File(img_temp)
                    )
                    return path
                    
            # If it's a local file path
            elif os.path.exists(image_url):
                with open(image_url, 'rb') as f:
                    path = default_storage.save(
                        f'product_images/{image_name}',
                        File(f)
                    )
                    return path

        except Exception as e:
            print(f"Error processing image {image_url}: {str(e)}")
            return None

        return None

    def update_or_create_product(self, row, category, made_of, country, brand, image_path):
        """
        Helper method to update existing product or create new one
        """
        try:
            product = Product.objects.filter(pid=row['pid']).first()
            
            product_data = {
                'name': row['name'],
                'description': row['description'],
                'price': float(row['price']),
                'quantity': row['quantity'],
                'brand': brand,
                'country': country,
                'made_of': made_of,
                'category': category,
                'stock_quantity': int(row['stock']),
            }
            
            if image_path:
                product_data['image'] = image_path

            if product:
                # Update existing product
                for key, value in product_data.items():
                    setattr(product, key, value)
                product.save()
                return product, 'updated'
            else:
                # Create new product
                product_data['pid'] = row['pid']
                product = Product.objects.create(**product_data)
                return product, 'created'

        except Exception as e:
            raise Exception(f"Error processing product with PID {row['pid']}: {str(e)}")

    def post(self, request):
        try:
            file = request.FILES.get('file')
            if not file:
                return Response({'error': 'No file provided'}, status=status.HTTP_400_BAD_REQUEST)

            # Read Excel file
            df = pd.read_excel(file)
            required_columns = ['pid', 'name', 'category', 'made-of', 'country', 
                              'description', 'price', 'stock', 'quantity']
            
            if not all(col in df.columns for col in required_columns):
                return Response({'error': 'Missing required columns'}, 
                              status=status.HTTP_400_BAD_REQUEST)

            products_processed = []
            errors = []
            image_errors = []

            for index, row in df.iterrows():
                try:
                    # Get or create related objects
                    category = self.get_or_create_related(Category, row['category'])
                    made_of = self.get_or_create_related(MadeOf, row['made-of'])
                    country = self.get_or_create_related(Country, row['country'])
                    brand = self.get_or_create_related(Brand, row.get('brand', 'Default Brand'))

                    try:
                        stock_quantity = int(row['stock'])
                    except ValueError:
                        errors.append(f"Error in row {index + 2}: Invalid stock quantity '{row['stock']}'")
                        continue

                    if not isinstance(category, Category):
                        errors.append(f"Invalid category for product {row['name']}: {row['category']}")
                        continue

                    image_path = None
                    if 'image_url' in row and row['image_url']:
                        image_path = self.handle_image_url(row['image_url'])
                        if not image_path:
                            image_errors.append(
                                f"Failed to process image for product {row['name']}"
                            )

                    # Update or create product
                    product, action = self.update_or_create_product(
                        row, category, made_of, country, brand, image_path
                    )
                    
                    products_processed.append({
                        'name': product.name,
                        'pid': product.pid,
                        'action': action,
                        'image_status': 'Image processed successfully' if image_path 
                                      else 'No image or failed to process'
                    })
                    
                except Exception as e:
                    errors.append(f"Error in row {index + 2}: {str(e)}")

            # Prepare response summary
            created_count = sum(1 for p in products_processed if p['action'] == 'created')
            updated_count = sum(1 for p in products_processed if p['action'] == 'updated')
            
            response_data = {
                'message': f'Successfully processed {len(products_processed)} products '
                          f'({created_count} created, {updated_count} updated)',
                'products_processed': products_processed
            }
            
            if errors:
                response_data['errors'] = errors
            if image_errors:
                response_data['image_errors'] = image_errors

            return Response(response_data, status=status.HTTP_201_CREATED)

        except Exception as e:
            print("ERROR::", str(e))
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_wine_recommendations(request):
    event_id = request.GET.get('event')
    food_id = request.GET.get('food')
    
    recommendations = WineRecommendation.objects.all()
    
    if event_id:
        recommendations = recommendations.filter(events__id=event_id)
    if food_id:
        recommendations = recommendations.filter(food_pairings__id=food_id)
    
    # Add weighted scoring
    if event_id and food_id:
        recommendations = recommendations.order_by('-score', '-created_at')
    else:
        recommendations = recommendations.order_by('-score')
    
    recommendations = recommendations[:6]  # Limit to top 6
    
    serializer = WineRecommendationSerializer(recommendations, many=True)
    
    # Add additional context
    response_data = {
        'recommendations': serializer.data,
        'total_count': recommendations.count(),
        'filters_applied': {
            'event': bool(event_id),
            'food': bool(food_id)
        }
    }
    
    return Response(response_data)

@api_view(['GET'])
def get_events(request):
    events = WineEvent.objects.filter(is_active=True)
    serializer = WineEventSerializer(events, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_food_pairings(request):
    food_pairings = FoodPairing.objects.filter(is_active=True)
    serializer = FoodPairingSerializer(food_pairings, many=True)
    return Response(serializer.data)
