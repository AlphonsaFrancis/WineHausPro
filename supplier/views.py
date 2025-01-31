from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Sum, Count
from django.db.models.functions import TruncMonth
from .models import Supplier, SupplierProduct, StockAlert
from products.models import Product
from .serializers import SupplierProductSerializer, StockAlertSerializer
from django.db.models import Q

# Create your views here.

@api_view(['GET'])
def supplier_dashboard(request, supplier_id):
    try:
        # Get supplier's products
        supplier_products = SupplierProduct.objects.filter(supplier_id=supplier_id)
        
        # Get low stock products (less than 10 items)
        low_stock_products = supplier_products.filter(
            product__stock_quantity__lt=10
        ).select_related('product')
        
        # Get out of stock products
        out_of_stock = supplier_products.filter(
            product__stock_quantity=0
        ).select_related('product')
        
        # Get active alerts
        active_alerts = StockAlert.objects.filter(
            supplier_product__supplier_id=supplier_id,
            is_resolved=False
        )

        # Get monthly supply statistics
        monthly_stats = supplier_products.annotate(
            month=TruncMonth('last_supply_date')
        ).values('month').annotate(
            total_quantity=Sum('quantity_supplied'),
            total_products=Count('product')
        ).order_by('-month')

        return Response({
            'low_stock_count': low_stock_products.count(),
            'out_of_stock_count': out_of_stock.count(),
            'active_alerts_count': active_alerts.count(),
            'low_stock_products': SupplierProductSerializer(low_stock_products, many=True).data,
            'monthly_stats': monthly_stats,
        })

    except Exception as e:
        return Response({
            'error': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def supplier_products(request, supplier_id):
    products = SupplierProduct.objects.filter(supplier_id=supplier_id)
    serializer = SupplierProductSerializer(products, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def stock_alerts(request, supplier_id):
    alerts = StockAlert.objects.filter(
        supplier_product__supplier_id=supplier_id
    ).order_by('-created_at')
    serializer = StockAlertSerializer(alerts, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def update_stock(request, supplier_id, product_id):
    try:
        supplier_product = SupplierProduct.objects.get(
            supplier_id=supplier_id,
            product_id=product_id
        )
        
        new_quantity = request.data.get('quantity')
        if new_quantity is not None:
            supplier_product.quantity_supplied = new_quantity
            supplier_product.save()
            
            # Update product stock
            product = supplier_product.product
            product.stock_quantity = new_quantity
            product.save()
            
            return Response({'message': 'Stock updated successfully'})
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
