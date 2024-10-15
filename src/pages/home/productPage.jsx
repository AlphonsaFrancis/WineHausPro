import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../../components/Navbar';
import './product.css';

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('authToken');

  const BASE_URL = 'http://127.0.0.1:8000';
  
  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/v1/products/list/')
      .then(response => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading products...</div>;
  }

  if (error) {
    return <div>Error fetching products: {error}</div>;
  }

  return (
    <div>
      <Navbar /> {/* Place the Navbar component here */}
      <div className="hard-product-page">
        <h1 className="hard-page-title">Discover Our Premium Products</h1>

        <div className="hard-main-content">
          {/* Sidebar Filter Section */}
          <aside className="hard-filter-sidebar">
            <h3>Filter & Sort</h3>

            {/* Sort Bar */}
            <div className="hard-sort-bar">
              <label htmlFor="sortOrder">Sort by:</label>
              <select id="sortOrder">
                <option value="default">Default</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Rating</option>
              </select>
            </div>

            {/* Category Filter */}
            <div className="hard-filter-group">
              <h4>Category</h4>
              <select id="filterCategory">
                <option value="all">All</option>
                <option value="Frateli">Red</option>
                <option value="Zamba">White</option>
                <option value="Spade & Spare">Rose</option>
                <option value="Riesling">Sparkling</option>
              </select>
            </div>
            
            <div className="hard-filter-group">
              <h4>Brand</h4>
              <select id="filterCategory">
                <option value="all">All</option>
                <option value="Frateli">Frateli</option>
                <option value="Zamba">Zamba</option>
                <option value="Spade & Spare">Spade & Spare</option>
                <option value="Riesling">Riesling</option>
              </select>
            </div>

            {/* Country Filter */}
            <div className="hard-filter-group">
              <h4>Country</h4>
              <select id="filterCountry">
                <option value="all">All</option>
                <option value="India">India</option>
                <option value="France">France</option>
                <option value="Italy">Italy</option>
                <option value="Russia">Russia</option>
              </select>
            </div>

            {/* Made Of Filter */}
            <div className="hard-filter-group">
              <h4>Made Of</h4>
              <select id="filterMadeOf">
                <option value="all">All</option>
                <option value="Wood">Wood</option>
                <option value="Metal">Metal</option>
                <option value="Glass">Glass</option>
              </select>
            </div>
          </aside>

          {/* Main Product Display Section */}
          <div className="hard-product-display">
            <div className="hard-products-grid">
              {products.map(product => (
                <div className="hard-product-card" key={product.product_id}>
                  <a href={`/products/${product.product_id}`} className="hard-product-link">
                  <img
                    src={product.image ? `${BASE_URL}${product.image}` : 'https://via.placeholder.com/150'}
                    alt={product.name}
                    className="hard-product-image"
                  />
                    <div className="hard-product-info">
                      <h4>{product.name}</h4>
                      <p className="hard-price">₹ {product.price}</p>

                    </div>
                  </a>
                  <div className="hard-product-actions">
                    <button className="hard-wishlist-btn">
                      <i className="fas fa-heart"></i> Wishlist
                    </button>
                    <button className="hard-cart-btn">
                      <i className="fas fa-shopping-cart"></i> Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
