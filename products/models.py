from django.db import models

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

    def __str__(self):
        return self.name


# ############################
#  FEEDBACK AND SENTIMENT ANALYSIS
# #############################


class Review(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    rating = models.PositiveSmallIntegerField()  # 1 to 5
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
