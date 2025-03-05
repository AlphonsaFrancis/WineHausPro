import React, { useState } from 'react';
import './WineRecommendationForm.css';

const WineRecommendationForm = ({ onSubmit, onClose }) => {
  const [preferences, setPreferences] = useState({
    taste: 3,
    acidity: 3.2,
    alcohol_content: 12.5
  });

  const getTasteDescription = (value) => {
    if (value <= 1.5) return "Light & Delicate";
    if (value <= 2.5) return "Mild & Smooth";
    if (value <= 3.5) return "Medium-Bodied";
    if (value <= 4.5) return "Full-Bodied";
    return "Rich & Intense";
  };

  const getAcidityDescription = (value) => {
    if (value <= 2.8) return "Low (Soft)";
    if (value <= 3.2) return "Medium-Low";
    if (value <= 3.6) return "Medium (Balanced)";
    if (value <= 4.0) return "Medium-High (Crisp)";
    return "High (Very Bright)";
  };

  const getAlcoholDescription = (value) => {
    if (value <= 10.5) return "Light-Bodied (8-10.5%)";
    if (value <= 12.5) return "Medium-Bodied (10.5-12.5%)";
    if (value <= 13.5) return "Full-Bodied (12.5-13.5%)";
    if (value <= 14.5) return "Bold (13.5-14.5%)";
    return "Very Bold (14.5%+)";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting preferences:", preferences);
    onSubmit(preferences);
  };

  return (
    <div className="recommendation-form-overlay">
      <div className="recommendation-form">
        <button className="close-btn" onClick={onClose}>&times;</button>
        <h3>Your Wine Preferences</h3>
        <p className="form-description">
          Tell us your taste preferences and we'll find wines that match your palate
        </p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Body & Taste Intensity:</label>
            <div className="slider-container">
              <input
                type="range"
                min="1"
                max="5"
                step="0.5"
                value={preferences.taste}
                onChange={(e) => setPreferences({
                  ...preferences,
                  taste: parseFloat(e.target.value)
                })}
              />
              <div className="value-description">
                <span>{preferences.taste}</span>
                <span className="description">{getTasteDescription(preferences.taste)}</span>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Acidity Level (pH Scale):</label>
            <div className="slider-container">
              <input
                type="range"
                min="2.8"
                max="4.0"
                step="0.1"
                value={preferences.acidity}
                onChange={(e) => setPreferences({
                  ...preferences,
                  acidity: parseFloat(e.target.value)
                })}
              />
              <div className="value-description">
                <span>pH {preferences.acidity}</span>
                <span className="description">{getAcidityDescription(preferences.acidity)}</span>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Alcohol Content (ABV):</label>
            <div className="slider-container">
              <input
                type="range"
                min="8.5"
                max="15.0"
                step="0.5"
                value={preferences.alcohol_content}
                onChange={(e) => setPreferences({
                  ...preferences,
                  alcohol_content: parseFloat(e.target.value)
                })}
              />
              <div className="value-description">
                <span>{preferences.alcohol_content}% ABV</span>
                <span className="description">{getAlcoholDescription(preferences.alcohol_content)}</span>
              </div>
            </div>
          </div>

          <div className="preferences-info">
            <p>Wine Characteristics Guide:</p>
            <ul>
              <li>Body & Taste: Ranges from light and delicate to rich and intense</li>
              <li>Acidity: pH 2.8 (very acidic) to 4.0 (less acidic)</li>
              <li>Alcohol: 8.5% (light wines) to 15% (full-bodied wines)</li>
            </ul>
          </div>

          <button type="submit" id="clicksOnRecommend" className="submit-btn">
            Find My Perfect Wine
          </button>
        </form>
      </div>
    </div>
  );
};

export default WineRecommendationForm; 