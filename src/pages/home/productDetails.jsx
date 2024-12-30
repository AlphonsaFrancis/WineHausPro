  // import React, { useEffect, useState } from "react";
  // import axios from "axios";
  // import { useParams } from "react-router-dom";
  // import "./product-detail.css";
  // import Navbar from "../../components/Navbar";
  // import config from "../../config/config";
  // import ReviewBox from "../../components/ReviewBox";

  // import {formatTimestamp} from "./helper"
  // import ProductReviews from "../../components/ProductReviews";

  // const ProductDetail = () => {
  //   const { id } = useParams();
  //   const [product, setProduct] = useState(null);
  //   const [loading, setLoading] = useState(true);
  //   const [error, setError] = useState(null);
  //   const [categories, setCategories] = useState({});
  //   const [brands, setBrands] = useState({});
  //   const [countries, setCountries] = useState({});
  //   const [materials, setMaterials] = useState({});
  //   const BASE_URL = "http://127.0.0.1:8000";
  //   const [quantity, setQuantity] = useState(1);
  //   const userId = localStorage.getItem("userId");
  //   const [reviews, setReviews] = useState([]);
  //   const [reviewSummary, setReviewSummary] = useState([])

  //   useEffect(() => {
  //     axios
  //       .get(`${config.BASE_URL}api/v1/products/details/${id}/`)
  //       .then((response) => {
  //         setProduct(response.data);
  //         setLoading(false);
  //       })
  //       .catch((error) => {
  //         setError(error.message);
  //         setLoading(false);
  //       });

  //     axios
  //       .get(`${config.BASE_URL}api/v1/products/category-list/`)
  //       .then((response) => {
  //         const categoryMap = response.data.reduce((acc, category) => {
  //           acc[category.id] = category.name;
  //           return acc;
  //         }, {});
  //         setCategories(categoryMap);
  //       });

  //     axios
  //       .get(`${config.BASE_URL}api/v1/products/brand-list/`)
  //       .then((response) => {
  //         const brandMap = response.data.reduce((acc, brand) => {
  //           acc[brand.brand_id] = brand.name;
  //           return acc;
  //         }, {});
  //         setBrands(brandMap);
  //       });

  //     axios
  //       .get(`${config.BASE_URL}api/v1/products/country-list/`)
  //       .then((response) => {
  //         const countryMap = response.data.reduce((acc, country) => {
  //           acc[country.country_id] = country.name;
  //           return acc;
  //         }, {});
  //         setCountries(countryMap);
  //       });

  //     axios
  //       .get(`${config.BASE_URL}api/v1/products/madeof-list/`)
  //       .then((response) => {
  //         const materialMap = response.data.reduce((acc, material) => {
  //           acc[material.madeof_id] = material.name;
  //           return acc;
  //         }, {});
  //         setMaterials(materialMap);
  //       });
  //   }, [id]);

  //   useEffect(() => {
  //     axios
  //       .get(`${config.BASE_URL}api/v1/products/${id}/review-summary/`)
  //       .then((response) => {
  //         setReviewSummary(response.data.data);
  //       })
  //       .catch((err) => {
  //         console.log("Error", err);
  //       });

  //       axios.get(`${config.BASE_URL}api/v1/products/${id}/reviews/`)
  //       .then((response) => {
  //         console.log("reviews", response)
  //         setReviews(response.data.data);
  //       })
  //       .catch((err) => {
  //         console.log("Error", err);
  //         });
  //   }, [id]);


  //   const addToCart = (productId, quantity = 1) => {
  //     const userId = localStorage.getItem("userId");
  //     if (!userId) {
  //       alert("Please log in first to add items to the cart.");
  //       return;
  //     }
  //     console.log(userId);

  //     axios
  //       .get(`${config.BASE_URL}api/v1/orders/cart-list/?user_id=${userId}`)
  //       .then((response) => {
  //         let cartId;

  //         if (response.data.length > 0) {
  //           cartId = response.data[0].cart_id; // Assuming first cart for the user
  //         } else {
  //           return axios
  //             .post(`${config.BASE_URL}api/v1/orders/cart-list/`, {
  //               user_id: userId,
  //             })
  //             .then((response) => {
  //               cartId = response.data.cart_id;
  //               return cartId;
  //             });
  //         }

  //         return cartId;
  //       })
  //       .then((cartId) => {
  //         const dataToSend = {
  //           user_id: userId,
  //           product_id: productId,
  //           quantity: quantity,
  //         };

  //         return axios.post(
  //           `${config.BASE_URL}api/v1/orders/cart-items-create/`,
  //           dataToSend
  //         );
  //       })
  //       .then(() => {
  //         alert("Product added to cart!");
  //       })
  //       .catch((error) => {
  //         alert("Error adding the product to the cart!");
  //       });
  //   };
  //   const addToWishlist = (productId) => {
  //     if (!userId) {
  //       alert("Please log in first to add items to the wishlist.");
  //       return;
  //     }

  //     axios
  //       .get(`${config.BASE_URL}api/v1/orders/wishlist-list/?user_id=${userId}`)
  //       .then((response) => {
  //         let wishlistId;

  //         if (response.data.length > 0) {
  //           wishlistId = response.data[0].wishlist_id;
  //         } else {
  //           return axios
  //             .post(`${config.BASE_URL}api/v1/orders/wishlist-list/`, {
  //               user_id: userId,
  //             })
  //             .then((response) => {
  //               wishlistId = response.data.wishlist_id;
  //             });
  //         }

  //         return wishlistId;
  //       })
  //       .then((wishlistId) => {
  //         return axios.post(
  //           `${config.BASE_URL}api/v1/orders/wishlist-items-create/`,
  //           {
  //             wishlist_id: wishlistId,
  //             product_id: productId,
  //           }
  //         );
  //       })
  //       .then(() => {
  //         alert("Product added to wishlist!");
  //       })
  //       .catch((error) => {
  //         if (
  //           error.response &&
  //           error.response.data &&
  //           error.response.data.error === "Product is already in the wishlist"
  //         ) {
  //           alert("Product is already in the wishlist.");
  //         } else {
  //           alert("Error adding product to wishlist!");
  //         }
  //       });
  //   };

  //   if (loading) {
  //     return <div>Loading...</div>;
  //   }

  //   if (error) {
  //     return <div>Error: {error}</div>;
  //   }

  //   if (!product) {
  //     return <div>Product not found</div>;
  //   }

  //   const isOutOfStock = product.stock_quantity === 0;
  //   const isUnavailable = !product.is_active || isOutOfStock;

  //   return (
  //     <div>
  //       <Navbar />
  //       <div className="product-detail-page">
  //         {product && (
  //           <>
  //             <nav className="product-detail-breadcrumb">
  //               <a href="/products">Home</a> / {categories[product.category]} /{" "}
  //               {product.name}
  //             </nav>
  //             <div className="product-detail-container">
  //               <div className="product-detail-image-container">
  //                 <img
  //                   src={
  //                     product.image
  //                       ? `${config.BASE_URL}${product.image} `
  //                       : "https://via.placeholder.com/400"
  //                   }
  //                   alt={product.name}
  //                   className="product-detail-image"
  //                 />
  //               </div>
  //               <div className="product-detail-info">
  //                 <h1 className="product-detail-name">{product.name}</h1>
  //                 <p className="product-detail-price">₹ {product.price}</p>
  //                 <p className="product-detail-description">
  //                   {product.description}
  //                 </p>
  //                 <p className="product-detail-brand">
  //                   <strong>Brand:</strong> {brands[product.brand]}
  //                 </p>
  //                 <p className="product-detail-category">
  //                   <strong>Category:</strong> {categories[product.category]}
  //                 </p>
  //                 <p className="product-detail-material">
  //                   <strong>Made Of:</strong> {materials[product.made_of]}
  //                 </p>
  //                 <p className="product-detail-country">
  //                   <strong>Country:</strong> {countries[product.country]}
  //                 </p>
  //                 <p className="product-detail-stock">
  //                   <strong>In Stock:</strong>{" "}
  //                   {isOutOfStock ? "Out of Stock" : product.stock_quantity}
  //                 </p>

  //                 {reviewSummary.product_id ? (
  //                   <div>
  //                     <ReviewBox feedbackSummaryProd={reviewSummary} />
  //                   </div>
  //                 ) : null}

  //                 <div className="product-detail-actions">
  //                   <button
  //                     onClick={() => addToCart(product.product_id, 1)}
  //                     className="add-to-cart-button"
  //                     disabled={isUnavailable}
  //                   >
  //                     <i className="fas fa-shopping-cart"></i> Add to Cart
  //                   </button>
  //                   <button
  //                     className="wishlist-button"
  //                     onClick={() => addToWishlist(product.product_id)}
  //                   >
  //                     Wishlist
  //                   </button>
  //                 </div>
  //                 {isUnavailable && (
  //                   <p className="product-unavailable-message">
  //                     {isOutOfStock
  //                       ? "This product is out of stock."
  //                       : "This product is currently unavailable."}
  //                   </p>
  //                 )}
  //               </div>
  //               <div className="product-review-container" >
  //                 {reviews?.length>0 ? 
  //                 <>
  //                 <h2>Reviews</h2>

                  
  //                   <ProductReviews reviews={reviews}/>
                  

  //                 </>:null}

  //               </div>
  //             </div>
  //           </>
  //         )}
  //       </div>
  //     </div>
  //   );
  // };

  // export default ProductDetail;

  import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./product-detail.css";
import Navbar from "../../components/Navbar";
import config from "../../config/config";
import ReviewBox from "../../components/ReviewBox";
import { MdShoppingCart, MdFavoriteBorder, MdLocationOn, MdCategory, MdBusinessCenter, MdInventory } from "react-icons/md";
import { formatTimestamp } from "./helper";
import ProductReviews from "../../components/ProductReviews";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState({});
  const [brands, setBrands] = useState({});
  const [countries, setCountries] = useState({});
  const [materials, setMaterials] = useState({});
  const [reviews, setReviews] = useState([]);
  const [reviewSummary, setReviewSummary] = useState([]);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const [productRes, categoryRes, brandRes, countryRes, materialRes] = await Promise.all([
          axios.get(`${config.BASE_URL}api/v1/products/details/${id}/`),
          axios.get(`${config.BASE_URL}api/v1/products/category-list/`),
          axios.get(`${config.BASE_URL}api/v1/products/brand-list/`),
          axios.get(`${config.BASE_URL}api/v1/products/country-list/`),
          axios.get(`${config.BASE_URL}api/v1/products/madeof-list/`)
        ]);

        setProduct(productRes.data);
        setCategories(categoryRes.data.reduce((acc, cat) => ({ ...acc, [cat.id]: cat.name }), {}));
        setBrands(brandRes.data.reduce((acc, brand) => ({ ...acc, [brand.brand_id]: brand.name }), {}));
        setCountries(countryRes.data.reduce((acc, country) => ({ ...acc, [country.country_id]: country.name }), {}));
        setMaterials(materialRes.data.reduce((acc, material) => ({ ...acc, [material.madeof_id]: material.name }), {}));
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const [summaryRes, reviewsRes] = await Promise.all([
          axios.get(`${config.BASE_URL}api/v1/products/${id}/review-summary/`),
          axios.get(`${config.BASE_URL}api/v1/products/${id}/reviews/`)
        ]);
        
        setReviewSummary(summaryRes.data.data);
        setReviews(reviewsRes.data.data);
      } catch (err) {
        console.error("Error fetching reviews:", err);
      }
    };

    fetchReviews();
  }, [id]);

  const addToCart = async (productId, quantity = 1) => {
    if (!userId) {
      alert("Please log in first to add items to the cart.");
      return;
    }

    try {
      const cartResponse = await axios.get(`${config.BASE_URL}api/v1/orders/cart-list/?user_id=${userId}`);
      let cartId;

      if (cartResponse.data.length > 0) {
        cartId = cartResponse.data[0].cart_id;
      } else {
        const newCartResponse = await axios.post(`${config.BASE_URL}api/v1/orders/cart-list/`, {
          user_id: userId,
        });
        cartId = newCartResponse.data.cart_id;
      }

      await axios.post(`${config.BASE_URL}api/v1/orders/cart-items-create/`, {
        user_id: userId,
        product_id: productId,
        quantity,
      });

      alert("Product added to cart!");
    } catch (error) {
      alert("Error adding the product to the cart!");
    }
  };

  const addToWishlist = async (productId) => {
    if (!userId) {
      alert("Please log in first to add items to the wishlist.");
      return;
    }

    try {
      const wishlistResponse = await axios.get(`${config.BASE_URL}api/v1/orders/wishlist-list/?user_id=${userId}`);
      let wishlistId;

      if (wishlistResponse.data.length > 0) {
        wishlistId = wishlistResponse.data[0].wishlist_id;
      } else {
        const newWishlistResponse = await axios.post(`${config.BASE_URL}api/v1/orders/wishlist-list/`, {
          user_id: userId,
        });
        wishlistId = newWishlistResponse.data.wishlist_id;
      }

      await axios.post(`${config.BASE_URL}api/v1/orders/wishlist-items-create/`, {
        wishlist_id: wishlistId,
        product_id: productId,
      });

      alert("Product added to wishlist!");
    } catch (error) {
      if (error.response?.data?.error === "Product is already in the wishlist") {
        alert("Product is already in the wishlist.");
      } else {
        alert("Error adding product to wishlist!");
      }
    }
  };

  if (loading) return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Loading product details...</p>
    </div>
  );

  if (error) return (
    <div className="error-container">
      <p>Error: {error}</p>
      <button onClick={() => window.location.reload()}>Try Again</button>
    </div>
  );

  if (!product) return (
    <div className="not-found-container">
      <h2>Product Not Found</h2>
      <p>The product you're looking for doesn't exist.</p>
      <a href="/products" className="back-button">Back to Products</a>
    </div>
  );

  const isOutOfStock = product.stock_quantity === 0;
  const isUnavailable = !product.is_active || isOutOfStock;

  return (
    <div>
      <Navbar />
      <div className="product-detail-page">
        <nav className="product-detail-breadcrumb">
          <a href="/products">Home</a> / {categories[product.category]} / {product.name}
        </nav>

        <div className="product-detail-container">
          <div className="product-detail-image-container">
            <img
              src={product.image ? `${config.BASE_URL}${product.image}` : "https://via.placeholder.com/400"}
              alt={product.name}
              className="product-detail-image"
            />
          </div>

          <div className="product-detail-info">
            <h1 className="product-detail-name">{product.name}</h1>
            <p className="product-detail-price">₹ {product.price.toLocaleString()}</p>
            
            <p className="product-detail-description">{product.description}</p>
            
            <div className="product-detail-specs">
              <p className="product-detail-brand">
                <MdBusinessCenter />
                <strong>Brand:</strong> {brands[product.brand]}
              </p>
              <p className="product-detail-category">
                <MdCategory />
                <strong>Category:</strong> {categories[product.category]}
              </p>
              <p className="product-detail-material">
                <MdInventory />
                <strong>Made Of:</strong> {materials[product.made_of]}
              </p>
              <p className="product-detail-country">
                <MdLocationOn />
                <strong>Country:</strong> {countries[product.country]}
              </p>
              <p className={`product-detail-stock ${isOutOfStock ? 'out-of-stock' : ''}`}>
                <strong>In Stock:</strong> {isOutOfStock ? "Out of Stock" : product.stock_quantity}
              </p>
            </div>

            {reviewSummary.product_id && (
              <div className="review-summary-section">
                <ReviewBox feedbackSummaryProd={reviewSummary} />
              </div>
            )}

            <div className="product-detail-actions">
              <button
                onClick={() => addToCart(product.product_id, 1)}
                className="add-to-cart-button"
                disabled={isUnavailable}
              >
                <MdShoppingCart /> Add to Cart
              </button>
              <button
                className="wishlist-button"
                onClick={() => addToWishlist(product.product_id)}
              >
                <MdFavoriteBorder /> Wishlist
              </button>
            </div>

            {isUnavailable && (
              <p className="product-unavailable-message">
                {isOutOfStock ? "This product is out of stock." : "This product is currently unavailable."}
              </p>
            )}
          </div>

          {reviews?.length > 0 && (
            <div className="product-review-container">
              <h2>Customer Reviews</h2>
              <div className="reviews-grid">
                <ProductReviews reviews={reviews} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
