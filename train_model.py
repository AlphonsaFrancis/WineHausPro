
import pandas as pd
from sklearn.neighbors import NearestNeighbors
from sklearn.preprocessing import MinMaxScaler
import joblib

# Dataset
data = {
    'wine_id': [1, 2, 3, 4, 5],
    'name': ['Wine A', 'Wine B', 'Wine C', 'Wine D', 'Wine E'],
    'taste': [5, 3, 4, 2, 5],  
    'acidity': [3, 4, 2, 5, 3],  
    'alcohol_content': [12.5, 13.0, 12.0, 14.0, 13.5], 
}

df = pd.DataFrame(data)

# Features to scale
features = ['taste', 'acidity', 'alcohol_content']

# Initialize the scaler
scaler = MinMaxScaler()

# Scale the features
df[features] = scaler.fit_transform(df[features])

# Train the model
X = df[features]
model = NearestNeighbors(n_neighbors=2, algorithm='ball_tree').fit(X)

# Save the model and scaler
joblib.dump(model, 'wine_recommender_model.pkl')
joblib.dump(scaler, 'wine_scaler.pkl')

print("Model and scaler saved successfully!")