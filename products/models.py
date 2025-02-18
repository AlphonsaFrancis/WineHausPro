from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from .utils import send_low_stock_notification
from django.utils import timezone
from datetime import timedelta

from authentication.models import User


class Category(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    description = models.TextField()
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name


class MadeOf(models.Model):
    madeof_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    description = models.TextField()
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name


class Country(models.Model):
    country_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    description = models.CharField(max_length=255, null=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name


class Brand(models.Model):
    brand_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    description = models.TextField()
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name


class Product(models.Model):
    product_id = models.AutoField(primary_key=True)
    pid = models.CharField(max_length=255,unique=True,null=True, default=None)
    name = models.CharField(max_length=255)
    description = models.TextField()
    price = models.FloatField()
    quantity = models.CharField(max_length=255)
    brand = models.ForeignKey("Brand", on_delete=models.CASCADE)
    country = models.ForeignKey("Country", on_delete=models.CASCADE)
    made_of = models.ForeignKey("MadeOf", on_delete=models.CASCADE)
    category = models.ForeignKey("Category", on_delete=models.CASCADE)
    stock_quantity = models.IntegerField()
    image = models.ImageField(upload_to="product_images/", null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    approved=models.BooleanField(default=True)
    
    # Add minimum stock threshold
    min_stock_threshold = models.IntegerField(default=10)
    
    def check_stock_level(self):
        """Check if stock is below threshold"""
        return self.stock_quantity <= self.min_stock_threshold

    def is_new_arrival(self):
        """Check if product is added within last 30 days"""
        thirty_days_ago = timezone.now() - timedelta(days=30)
        return self.created_at >= thirty_days_ago

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['-created_at']  # Default ordering by newest first


# ############################
#  FEEDBACK AND SENTIMENT ANALYSIS
# #############################


class Review(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    order_id = models.IntegerField(default=None)
    rating = models.PositiveSmallIntegerField(null=True)  # 1 to 5
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Review of {str(self.product.name)} by {str(self.user.email)}"


class SentimentAnalysis(models.Model):
    review = models.OneToOneField(
        Review, on_delete=models.CASCADE, related_name="sentiment"
    )
    sentiment = models.CharField(max_length=50)
    score = models.FloatField()
    analyzed_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f" {str(self.review)} - {str(self.sentiment)}"


class WineEvent(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name


class FoodPairing(models.Model):
    name = models.CharField(max_length=255)
    category = models.CharField(max_length=100)  # e.g., meat, seafood, dessert
    description = models.TextField()
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name


class WineRecommendation(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    events = models.ManyToManyField(WineEvent)
    food_pairings = models.ManyToManyField(FoodPairing)
    recommendation_text = models.TextField()
    score = models.FloatField(default=0)  # Recommendation score
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Recommendation for {self.product.name}"


@receiver(post_save, sender=Product)
def product_stock_check(sender, instance, **kwargs):
    """
    Signal handler to check stock levels whenever a product is saved
    """
    if instance.check_stock_level():
        send_low_stock_notification(instance)
