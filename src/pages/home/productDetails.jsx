import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './product-detail.css';
import Navbar from '../../components/Navbar';

const ProductDetail = () => {
  const { id } = useParams(); // Get the product ID from the URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState({});
  const [brands, setBrands] = useState({});
  const [countries, setCountries] = useState({});
  const [materials, setMaterials] = useState({});
  const token = localStorage.getItem('authToken');


  useEffect(() => {
    // Fetch product details
    axios.get(`http://127.0.0.1:8000/api/v1/products/details/${id}/`,{
        headers: {
        Authorization: `Bearer ${token}`,
      },
    }
      )
      .then(response => {
        setProduct(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });

    // Fetch category data
    axios.get('http://127.0.0.1:8000/api/v1/products/category-list/',{
        headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => {
        const categoryMap = response.data.reduce((acc, category) => {
          acc[category.id] = category.name;
          return acc;
        }, {});
        setCategories(categoryMap);
      });

    // Fetch brand data
    axios.get('http://127.0.0.1:8000/api/v1/products/brand-list/',{
        headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => {
        const brandMap = response.data.reduce((acc, brand) => {
          acc[brand.brand_id] = brand.name;
          return acc;
        }, {});
        setBrands(brandMap);
      });

    // Fetch country data
    axios.get('http://127.0.0.1:8000/api/v1/products/country-list/',{
        headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => {
        const countryMap = response.data.reduce((acc, country) => {
          acc[country.country_id] = country.name;
          return acc;
        }, {});
        setCountries(countryMap);
      });

    // Fetch material data
    axios.get('http://127.0.0.1:8000/api/v1/products/madeof-list/',{
        headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => {
        const materialMap = response.data.reduce((acc, material) => {
          acc[material.madeof_id] = material.name;
          return acc;
        }, {});
        setMaterials(materialMap);
      });

  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div>
      <Navbar />
      <div className="product-detail-page">
        {product && (
          <>
            <nav className="breadcrumb">
              <a href="/products">Home</a> / {categories[product.category]} / {product.name}
            </nav>

            <div className="product-container">
              <div className="product-image-container">
                <img
                  src={product.image || 'https://via.placeholder.com/600'}
                  alt={product.name}
                  className="main-product-image"
                />
              </div>

              <div className="product-info">
                <h1>{product.name}</h1>
                <p className="price">₹ {product.price}</p>
                <p className="rating">Rating: {product.rating}</p>
                <p className="description">{product.description}</p>

                <div className="product-details">
                  <h4>Product Details</h4>
                  <ul>
                    <li>Brand: {brands[product.brand]}</li>
                    <li>Category: {categories[product.category]}</li>
                    <li>Material: {materials[product.made_of]}</li>
                    <li>Country: {countries[product.country]}</li>
                    <li>Stock Quantity: {product.stock_quantity}</li>
                  </ul>
                </div>

                <div className="product-actions">
                  <button className="wishlist-btn">
                    <i className="fas fa-heart"></i> Add to Wishlist
                  </button>
                  <button className="cart-btn">
                    <i className="fas fa-shopping-cart"></i> Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
