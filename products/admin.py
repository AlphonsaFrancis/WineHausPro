from django.contrib import admin
from .models import Category,MadeOf,Country,Brand,Product, Review, SentimentAnalysis

admin.site.register(Category)
admin.site.register(MadeOf)
admin.site.register(Country)
admin.site.register(Brand)
admin.site.register(Product)
admin.site.register(Review)
admin.site.register(SentimentAnalysis)
