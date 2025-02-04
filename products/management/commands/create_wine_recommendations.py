from django.core.management.base import BaseCommand
from products.models import WineEvent, FoodPairing, WineRecommendation, Product

class Command(BaseCommand):
    help = 'Creates sample wine recommendations data'

    def handle(self, *args, **kwargs):
        # Create Events
        events = [
            {
                'name': 'Wedding Reception',
                'description': 'Elegant wines perfect for wedding celebrations'
            },
            {
                'name': 'Dinner Party',
                'description': 'Sophisticated wines for hosting dinner parties'
            },
            {
                'name': 'Birthday Celebration',
                'description': 'Fun and festive wines for birthday parties'
            },
            {
                'name': 'Business Meeting',
                'description': 'Professional wine selections for corporate events'
            },
            {
                'name': 'Holiday Gathering',
                'description': 'Seasonal wines for holiday celebrations'
            },
            {
                'name': 'Romantic Date',
                'description': 'Special wines for intimate occasions'
            }
        ]

        for event_data in events:
            WineEvent.objects.get_or_create(
                name=event_data['name'],
                defaults={'description': event_data['description']}
            )

        # Create Food Pairings
        food_pairings = [
            {
                'name': 'Grilled Steak',
                'category': 'Red Meat',
                'description': 'Full-bodied wines that complement red meat'
            },
            {
                'name': 'Seafood',
                'category': 'Fish',
                'description': 'Light, crisp wines perfect for seafood'
            },
            {
                'name': 'Pasta',
                'category': 'Italian',
                'description': 'Wines that complement Italian cuisine'
            },
            {
                'name': 'Spicy Asian',
                'category': 'Asian',
                'description': 'Wines that balance spicy Asian dishes'
            },
            {
                'name': 'Cheese Board',
                'category': 'Cheese',
                'description': 'Wines that pair well with various cheeses'
            },
            {
                'name': 'Dessert',
                'category': 'Sweet',
                'description': 'Sweet wines for dessert pairings'
            },
            {
                'name': 'BBQ',
                'category': 'Grilled',
                'description': 'Robust wines for barbecued foods'
            },
            {
                'name': 'Vegetarian',
                'category': 'Vegetable',
                'description': 'Wines that complement vegetarian dishes'
            }
        ]

        for food_data in food_pairings:
            FoodPairing.objects.get_or_create(
                name=food_data['name'],
                defaults={
                    'category': food_data['category'],
                    'description': food_data['description']
                }
            )

        # Create Wine Recommendations
        recommendations_data = [
            {
                'events': ['Wedding Reception', 'Business Meeting'],
                'food_pairings': ['Seafood', 'Cheese Board'],
                'recommendation_text': 'A sophisticated champagne with delicate bubbles and crisp finish. Perfect for celebrations and pairs beautifully with seafood.',
                'score': 4.8
            },
            {
                'events': ['Dinner Party', 'Romantic Date'],
                'food_pairings': ['Grilled Steak', 'BBQ'],
                'recommendation_text': 'A bold Cabernet Sauvignon with rich tannins and dark fruit notes. Excellent with red meats.',
                'score': 4.6
            },
            {
                'events': ['Holiday Gathering', 'Birthday Celebration'],
                'food_pairings': ['Pasta', 'Cheese Board'],
                'recommendation_text': 'A versatile Pinot Noir with balanced acidity and red fruit flavors. Great for various occasions.',
                'score': 4.5
            },
            {
                'events': ['Dinner Party', 'Business Meeting'],
                'food_pairings': ['Spicy Asian', 'Vegetarian'],
                'recommendation_text': 'An aromatic Riesling with subtle sweetness and bright acidity. Perfect with spicy dishes.',
                'score': 4.7
            }
        ]

        # Assign recommendations to products
        products = Product.objects.all()[:4]  # Get first 4 products
        for product, rec_data in zip(products, recommendations_data):
            recommendation = WineRecommendation.objects.create(
                product=product,
                recommendation_text=rec_data['recommendation_text'],
                score=rec_data['score']
            )
            
            # Add events
            events = WineEvent.objects.filter(name__in=rec_data['events'])
            recommendation.events.add(*events)
            
            # Add food pairings
            food_pairings = FoodPairing.objects.filter(name__in=rec_data['food_pairings'])
            recommendation.food_pairings.add(*food_pairings)

        self.stdout.write(self.style.SUCCESS('Successfully created wine recommendations data')) 