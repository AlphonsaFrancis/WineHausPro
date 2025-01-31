from django.db import models
from authentication.models import User
from products.models import Product

class Supplier(models.Model):
    supplier_id = models.AutoField(primary_key=True)
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    company_name = models.CharField(max_length=255)
    contact_number = models.CharField(max_length=20)
    address = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.company_name

class SupplierProduct(models.Model):
    supplier = models.ForeignKey(Supplier, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    supply_price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity_supplied = models.IntegerField()
    last_supply_date = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('supplier', 'product')

class StockAlert(models.Model):
    ALERT_TYPES = (
        ('LOW', 'Low Stock'),
        ('OUT', 'Out of Stock'),
        ('EXP', 'Expiring Soon')
    )
    
    supplier_product = models.ForeignKey(SupplierProduct, on_delete=models.CASCADE)
    alert_type = models.CharField(max_length=3, choices=ALERT_TYPES)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_resolved = models.BooleanField(default=False)

class StockRequest(models.Model):
    STATUS_CHOICES = (
        ('PENDING', 'Pending'),
        ('APPROVED', 'Approved'),
        ('REJECTED', 'Rejected')
    )
    
    supplier = models.ForeignKey(Supplier, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    requested_quantity = models.IntegerField()
    current_quantity = models.IntegerField()
    request_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='PENDING')
    admin_notes = models.TextField(null=True, blank=True)
