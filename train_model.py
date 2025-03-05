import pandas as pd
from sklearn.neighbors import NearestNeighbors
from sklearn.preprocessing import MinMaxScaler
import joblib

# Load the real dataset
df = pd.read_csv('wine_dataset.csv')

# Features to scale with names
feature_names = ['taste', 'acidity', 'alcohol_content']
X = df[feature_names]

# Initialize and fit the scaler with feature names
scaler = MinMaxScaler()
X_scaled = pd.DataFrame(
    scaler.fit_transform(X),
    columns=feature_names
)

# Train the model with more neighbors
model = NearestNeighbors(n_neighbors=5, algorithm='ball_tree').fit(X_scaled)

# Save the model, scaler and feature names
joblib.dump(model, 'wine_recommender_model.pkl')
joblib.dump(scaler, 'wine_scaler.pkl')
joblib.dump(feature_names, 'feature_names.pkl')

print("Model and scaler saved successfully!")