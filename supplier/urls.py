from django.urls import path
from . import views

urlpatterns = [
    path('dashboard/<int:supplier_id>/', views.supplier_dashboard, name='supplier_dashboard'),
    path('products/<int:supplier_id>/', views.supplier_products, name='supplier_products'),
    path('alerts/<int:supplier_id>/', views.stock_alerts, name='stock_alerts'),
    path('update-stock/<int:supplier_id>/<int:product_id>/', views.update_stock, name='update_stock'),
]
