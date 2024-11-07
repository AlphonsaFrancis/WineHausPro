import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
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
  const location = useLocation();

  const BASE_URL = 'http://127.0.0.1:8000';
  const userId = localStorage.getItem('userId'); // Get the logged-in user ID from localStorage

  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search') || '';

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${BASE_URL}/api/v1/products/list/?search=${searchQuery}`
        );
        console.log('Fetched Products:', response.data); // Debug log
        setProducts(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching products:', err); // Debug log
        setError('Failed to fetch products');
        setLoading(false);
      }
    };
  
    console.log('Search Query:', searchQuery); // Debug log
    fetchProducts();
  }, [BASE_URL, searchQuery]);

  // Fetch products based on filters or search query
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${BASE_URL}/api/v1/products/filter/`, {
        params: {
          category: category !== 'all' ? category : null,
          brand: brand !== 'all' ? brand : null,
          country: country !== 'all' ? country : null,
          made_of: madeOf !== 'all' ? madeOf : null,
          sort: sortOrder !== 'default' ? sortOrder : null,
        },
      });
      setProducts(response.data);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  // Fetch products on initial load or when filters change
  useEffect(() => {
    fetchProducts();
  }, [category, brand, country, madeOf, sortOrder]);

  // Function to add a product to the cart
  // const addToCart = async (productId, quantity = 1) => {
  //   if (!userId) {
  //     alert('Please log in first to add items to the cart.');
  //     return;
  //   }

  //   try {
  //     const cartResponse = await axios.get(
  //       `${BASE_URL}/api/v1/orders/cart-list/`,
  //       { params: { user_id: userId } }
  //     );

  //     let cartId = cartResponse.data.length
  //       ? cartResponse.data[0].cart_id
  //       : null;

  //     // Create a new cart if one doesn't exist
  //     if (!cartId) {
  //       const newCartResponse = await axios.post(
  //         `${BASE_URL}/api/v1/orders/cart-list/`,
  //         { user_id: userId }
  //       );
  //       cartId = newCartResponse.data.cart_id;
  //     }

  //     // Add the product to the cart
  //     await axios.post(`${BASE_URL}/api/v1/orders/cart-items-create/`, {
  //       cart_id: cartId,
  //       user_id: userId,
  //       product_id: productId,
  //       quantity: quantity,
  //     });

  //     alert('Product added to cart!');
  //   } catch (error) {
  //     console.error('Error adding product to cart:', error);
  //     alert('Error adding the product to the cart.');
  //   }
  // };
//   const addToCart = async (productId, quantity = 1) => {
//   if (!userId) {
//     alert('Please log in first to add items to the cart.');
//     return;
//   }

//   try {
//     // Fetch product details to check stock quantity
//     const productResponse = await axios.get(`${BASE_URL}/api/v1/products/details/${productId}/`);
//     const productStockQuantity = productResponse.data.stock_quantity;

//     // Fetch existing cart and cart item quantity
//     const cartResponse = await axios.get(
//       `${BASE_URL}/api/v1/orders/cart-list/`,
//       { params: { user_id: userId } }
//     );

//     let cartId = cartResponse.data.length ? cartResponse.data[0].cart_id : null;

//     // Create a new cart if one doesn't exist
//     if (!cartId) {
//       const newCartResponse = await axios.post(
//         `${BASE_URL}/api/v1/orders/cart-list/`,
//         { user_id: userId }
//       );
//       cartId = newCartResponse.data.cart_id;
//     }

//     // Check if the product is already in the cart and get the current quantity
//     const cartItemsResponse = await axios.get(`${BASE_URL}/api/v1/orders/cart-items/`, {
//       params: { cart_id: cartId, product_id: productId },
//     });

//     const currentCartQuantity = cartItemsResponse.data.length
//       ? cartItemsResponse.data[0].quantity
//       : 0;

//     // Check if adding the product exceeds stock quantity
//     if (currentCartQuantity + quantity > productStockQuantity) {
//       alert('Cannot add more of this product to the cart. Stock limit exceeded.');
//       return;
//     }

//     // Add the product to the cart
//     await axios.post(`${BASE_URL}/api/v1/orders/cart-items-create/`, {
//       cart_id: cartId,
//       user_id: userId,
//       product_id: productId,
//       quantity: quantity,
//     });

//     alert('Product added to cart!');
//   } catch (error) {
//     console.error('Error adding product to cart:', error);
//     alert('Error adding the product to the cart.');
//   }
// };
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
const addToWishlist = (productId) => {
  if (!userId) {
    alert("Please log in first to add items to the wishlist.");
    return;
  }

  axios.get(`http://127.0.0.1:8000/api/v1/orders/wishlist-list/?user_id=${userId}`)
    .then(response => {
      let wishlistId;

      if (response.data.length > 0) {
        wishlistId = response.data[0].wishlist_id;
      } else {
        return axios.post('http://127.0.0.1:8000/api/v1/orders/wishlist-list/', { user_id: userId })
          .then(response => {
            wishlistId = response.data.wishlist_id;
          });
      }

      return wishlistId;
    })
    .then(wishlistId => {
      return axios.post('http://127.0.0.1:8000/api/v1/orders/wishlist-items-create/', {
        wishlist_id: wishlistId,
        product_id: productId
      });
    })
    .then(() => {
      alert('Product added to wishlist!');
    })
    .catch(error => {
      if (error.response && error.response.data && error.response.data.error === "Product is already in the wishlist") {
        alert('Product is already in the wishlist.');
      } else {
        alert('Error adding product to wishlist!');
      }
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
        <h1 className="hard-page-title">
          {searchQuery
            ? `Search Results for "${searchQuery}"`
            : 'Discover Our Premium Products'}
        </h1>
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
              {products.length > 0 ? (
                products.map((product) => (
                  <div className="hard-product-card" key={product.product_id}>
                    <a
                      href={`/products/${product.product_id}`}
                      className="hard-product-link"
                    >
                      <img
                        src={
                          product.image
                            ? `${BASE_URL}${product.image}`
                            : 'https://via.placeholder.com/150'
                        }
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
                      <button className="hard-wishlist-btn" onClick={() => addToWishlist(product.product_id)}>
                        <i className="fas fa-heart"></i> Wishlist
                      </button>
                      <button
                        className="hard-cart-btn"
                        disabled={!product.is_active || product.stock_quantity === 0}
                        onClick={() => addToCart(product.product_id)}
                      >
                        <i className="fas fa-shopping-cart"></i> Add to Cart
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p>No products found for "{searchQuery}"</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;

