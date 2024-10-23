import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../../components/Navbar';
import Filter from '../../components/Filters';
import './product.css';

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // States for filters
  const [category, setCategory] = useState('all');
  const [brand, setBrand] = useState('all');
  const [country, setCountry] = useState('all');
  const [madeOf, setMadeOf] = useState('all');
  const [sortOrder, setSortOrder] = useState('default');

  const BASE_URL = 'http://127.0.0.1:8000';
  const loggedInUserId = 1; // Replace this with actual logged-in user ID from your authentication context

  // Fetch products with applied filters
  const fetchProducts = () => {
    setLoading(true);
    axios
      .get(`${BASE_URL}/api/v1/products/filter/`, {
        params: {
          category: category !== 'all' ? category : null,
          brand: brand !== 'all' ? brand : null,
          country: country !== 'all' ? country : null,
          made_of: madeOf !== 'all' ? madeOf : null,
          sort: sortOrder !== 'default' ? sortOrder : null,
        },
      })
      .then((response) => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  };

  // Fetch products on initial load or when filters change
  useEffect(() => {
    fetchProducts();
  }, [category, brand, country, madeOf, sortOrder]);

  // Function to add a product to the cart

  const addToCart = (productId, quantity = 1) => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert("Please log in first to add items to the cart.");
      return;
    }
    console.log(userId)
  
    axios.get(`http://127.0.0.1:8000/api/v1/orders/cart-list/?user_id=${userId}`)
      .then(response => {
        let cartId;
  
        if (response.data.length > 0) {
          cartId = response.data[0].cart_id; // Assuming first cart for the user
        } else {
          return axios.post('http://127.0.0.1:8000/api/v1/orders/cart-list/', { user_id: userId })
            .then(response => {
              cartId = response.data.cart_id;
              return cartId;
            });
        }
  
        return cartId;
      })
      .then(cartId => {
        const dataToSend = {
          user_id: userId,
          product_id: productId,
          quantity: quantity
        };
  
        return axios.post('http://127.0.0.1:8000/api/v1/orders/cart-items-create/', dataToSend);
      })
      .then(() => {
        alert('Product added to cart!');
      })
      .catch(error => {
        alert('Error adding the product to the cart!');
      });
  };

  if (loading) {
    return <div>Loading products...</div>;
  }

  if (error) {
    return <div>Error fetching products: {error}</div>;
  }

  return (
    <div>
      <Navbar />
      <div className="hard-product-page">
        <h1 className="hard-page-title">Discover Our Premium Products</h1>

        <div className="hard-main-content">
          <Filter
            category={category}
            setCategory={setCategory}
            brand={brand}
            setBrand={setBrand}
            country={country}
            setCountry={setCountry}
            madeOf={madeOf}
            setMadeOf={setMadeOf}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
          />

          <div className="hard-product-display">
            <div className="hard-products-grid">
              {products.map((product) => (
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
                    {(!product.is_active || product.stock_quantity === 0) && (
                      <p className="hard-out-of-stock-label">Out of Stock</p>
                    )}
                  </a>
                  <div className="hard-product-actions">
                    <button
                      className="hard-wishlist-btn"
                      // disabled={!product.is_active || product.stock_quantity === 0}
                    >
                      <i className="fas fa-heart"></i> Wishlist
                    </button>
                    <button
                      className="hard-cart-btn"
                      disabled={!product.is_active || product.stock_quantity === 0}
                      onClick={() => addToCart(product.product_id, 1)}
                    >
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
