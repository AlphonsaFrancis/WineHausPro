import React, { useState } from 'react';
import './productCard.css';
import axios from 'axios';

const BestSellers = () => {
  const [isFavorite, setIsFavorite] = useState(false);

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  return (
    <section className="best-sellers">
      <div className="head-seller">
        <h2>Best Sellers</h2>
      </div>
      <div className="product-container">
        <div className="product-card">
          <div className="product-image">
            <img
              src={'path_to_image/frat.png'} // replace with the correct image path or import
              alt="Fratelli Cabernet Sauvignon"
            />
          </div>
          <div className="product-info">
            <h3>Fratelli Cabernet Sauvignon</h3>
            <p>₹ 1300</p>
            <div className="product-meta">
              <span className="badge red">Red</span>
              <button
                className="favorite"
                onClick={toggleFavorite}
              >
                {isFavorite ? '❤️' : '♡'}
              </button>
            </div>
            <button className="buy-now">Buy Now</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BestSellers;
