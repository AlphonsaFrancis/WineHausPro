from rest_framework import serializers
from .models import Product, Category, MadeOf, Country, Brand, Review, SentimentAnalysis, WineEvent, FoodPairing, WineRecommendation
from django.utils import timezone
from django.conf import settings


class ProductSerializer(serializers.ModelSerializer):
    is_new = serializers.SerializerMethodField()
    days_since_added = serializers.SerializerMethodField()
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = "__all__"

    def get_is_new(self, obj):
        return obj.is_new_arrival()

    def get_days_since_added(self, obj):
        days = (timezone.now() - obj.created_at).days
        return days

    def get_image_url(self, obj):
        if obj.image:
            return f"{settings.BASE_URL}{obj.image.url}"
        return None


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"


class MadeOfSerializer(serializers.ModelSerializer):
    class Meta:
        model = MadeOf
        fields = "__all__"


class CountrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Country
        fields = "__all__"


class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brand
        fields = "__all__"


# ############################
#  FEEDBACK AND SENTIMENT ANALYSIS
# #############################
class SentimentAnalysisSerializer(serializers.ModelSerializer):
    class Meta:
        model = SentimentAnalysis
        fields = ("sentiment", "score", "analyzed_at")


class ReviewSerializer(serializers.ModelSerializer):
    sentiment = SentimentAnalysisSerializer(read_only=True)

    class Meta:
        model = Review
        fields = (
            "id",
            "user",
            "product",
            "order_id",
            "rating",
            "comment",
            "created_at",
            "updated_at",
            "sentiment",
        )
        read_only_fields = ("user", "product", "created_at", "updated_at")


class GetReviewSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()

    class Meta:
        model = Review
        fields = ("id", "user", "order_id", "product", "rating", "comment", "updated_at")

    def get_user(self, obj):
        return obj.user.name


class WineEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = WineEvent
        fields = '__all__'


class FoodPairingSerializer(serializers.ModelSerializer):
    class Meta:
        model = FoodPairing
        fields = '__all__'


class WineRecommendationSerializer(serializers.ModelSerializer):
    product = ProductSerializer()
    events = WineEventSerializer(many=True)
    food_pairings = FoodPairingSerializer(many=True)

    class Meta:
        model = WineRecommendation
        fields = '__all__'
