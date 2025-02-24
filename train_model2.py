import os
import django
from sklearn.neighbors import NearestNeighbors
from sklearn.preprocessing import MinMaxScaler
import joblib
import pandas as pd

# Set up Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'winehauspro.settings')  # Replace 'wineHaus' with your project name
django.setup()

# Now you can import Django models
from products.models import Product  # Replace 'products' with your app name

# Fetch data from the Product model
products = Product.objects.all()
data = {
    'wine_id': [product.product_id for product in products],
    'name': [product.name for product in products],
    'taste': [product.taste for product in products],  # Ensure these fields exist
    'acidity': [product.acidity for product in products],  # Ensure these fields exist
    'alcohol_content': [product.alcohol_content for product in products],  # Ensure these fields exist
}

# Convert to DataFrame
df = pd.DataFrame(data)

# Ensure numeric columns
df[['taste', 'acidity', 'alcohol_content']] = df[['taste', 'acidity', 'alcohol_content']].astype(float)

# Initialize the scaler
scaler = MinMaxScaler()

# Scale the features
df[['taste', 'acidity', 'alcohol_content']] = scaler.fit_transform(df[['taste', 'acidity', 'alcohol_content']])

# Train the model
X = df[['taste', 'acidity', 'alcohol_content']]
model = NearestNeighbors(n_neighbors=2, algorithm='ball_tree').fit(X)

# Save the model and scaler
joblib.dump(model, 'wine_recommender_model.pkl')
joblib.dump(scaler, 'wine_scaler.pkl')

print("Model and scaler saved successfully!")