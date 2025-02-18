import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../utils/config';
import './NewArrivals.css';

const NewArrivals = () => {
    const [newProducts, setNewProducts] = useState([]);
    const [loading, setLoading] = useState(true);

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
                        <img 
                            src={`${BASE_URL}${product.image}`} 
                            alt={product.name} 
                            className="product-image"
                        />
                        <div className="product-info">
                            <h3>{product.name}</h3>
                            <p className="price">₹{product.price}</p>
                            <p className="days-ago">
                                {product.days_since_added === 0 
                                    ? 'Added today' 
                                    : `Added ${product.days_since_added} days ago`}
                            </p>
                            <button className="view-details">View Details</button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default NewArrivals; 