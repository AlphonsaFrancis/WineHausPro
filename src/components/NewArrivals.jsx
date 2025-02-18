import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../utils/config';
import './NewArrivals.css';
import { useNavigate } from 'react-router-dom';
import config from '../config/config';

const NewArrivals = () => {
    const [newProducts, setNewProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const userId = localStorage.getItem("userId"); // Changed to match productPage.jsx

    useEffect(() => {
        const fetchNewArrivals = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/api/v1/products/new-arrivals/`);
                if (response.data.status === 'success') {
                    setNewProducts(response.data.data);
                }
            } catch (error) {
                console.error('Error fetching new arrivals:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchNewArrivals();
    }, []);

    const addToCart = (productId, quantity = 1) => {
        if (!userId) {
            alert("Please log in first to add items to the cart.");
            return;
        }

        axios
            .get(`${config.BASE_URL}api/v1/orders/cart-list/?user_id=${userId}`)
            .then((response) => {
                let cartId;

                if (response.data.length > 0) {
                    cartId = response.data[0].cart_id;
                } else {
                    return axios
                        .post(`${config.BASE_URL}api/v1/orders/cart-list/`, {
                            user_id: userId,
                        })
                        .then((response) => {
                            cartId = response.data.cart_id;
                            return cartId;
                        });
                }

                return cartId;
            })
            .then((cartId) => {
                const dataToSend = {
                    user_id: userId,
                    product_id: productId,
                    quantity: quantity,
                };

                return axios.post(
                    `${config.BASE_URL}api/v1/orders/cart-items-create/`,
                    dataToSend
                );
            })
            .then(() => {
                alert("Product added to cart!");
            })
            .catch((error) => {
                console.error('Error adding to cart:', error);
                alert("Error adding the product to the cart!");
            });
    };

    const addToWishlist = (productId) => {
        if (!userId) {
            alert("Please log in first to add items to the wishlist.");
            return;
        }

        axios
            .get(`${config.BASE_URL}api/v1/orders/wishlist-list/?user_id=${userId}`)
            .then((response) => {
                let wishlistId;

                if (response.data.length > 0) {
                    wishlistId = response.data[0].wishlist_id;
                } else {
                    return axios
                        .post(`${config.BASE_URL}api/v1/orders/wishlist-list/`, {
                            user_id: userId,
                        })
                        .then((response) => {
                            wishlistId = response.data.wishlist_id;
                            return wishlistId;
                        });
                }

                return wishlistId;
            })
            .then((wishlistId) => {
                return axios.post(
                    `${config.BASE_URL}api/v1/orders/wishlist-items-create/`,
                    {
                        wishlist_id: wishlistId,
                        product_id: productId,
                    }
                );
            })
            .then(() => {
                alert("Product added to wishlist!");
            })
            .catch((error) => {
                if (error.response?.data?.error === "Product is already in the wishlist") {
                    alert("Product is already in the wishlist.");
                } else {
                    alert("Error adding product to wishlist!");
                }
            });
    };

    const handleViewDetails = (productId) => {
        navigate(`/products/${productId}`);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <section className="new-arrivals-section">
            <div className="new-arrivals-header">
                <h2>New Arrivals</h2>
                <p>Discover our latest additions</p>
            </div>
            <div className="new-arrivals-container">
                {newProducts.map((product) => (
                    <div key={product.product_id} className="new-arrival-card">
                        <div className="new-badge">NEW</div>
                        <a href={`/products/${product.product_id}`} className="product-link">
                            <img 
                                src={product.image_url || `${BASE_URL}${product.image}`} 
                                alt={product.name} 
                                className="product-image"
                                style={{ cursor: 'pointer' }}
                            />
                            <div className="product-info">
                                <h3>{product.name}</h3>
                                <p className="price">₹{product.price}</p>
                                <p className="days-ago">
                                    {product.days_since_added === 0 
                                        ? 'Added today' 
                                        : `Added ${product.days_since_added} days ago`}
                                </p>
                            </div>
                        </a>
                        <div className="product-actions">
                            <button 
                                className="wishlist-btn"
                                onClick={() => addToWishlist(product.product_id)}
                            >
                                <i className="fas fa-heart"></i> Wishlist
                            </button>
                            <button 
                                className="cart-btn"
                                disabled={!product.is_active || product.stock_quantity === 0}
                                onClick={() => addToCart(product.product_id)}
                            >
                                <i className="fas fa-shopping-cart"></i> Add to Cart
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default NewArrivals; 