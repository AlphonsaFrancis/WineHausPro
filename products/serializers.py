from rest_framework import serializers
from .models import Product, Category, MadeOf, Country, Brand, Review, SentimentAnalysis


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = "__all__"


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
        fields = ("id", "user", "rating", "comment", "updated_at")

    def get_user(self, obj):
        return obj.user.name
