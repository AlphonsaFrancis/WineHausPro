import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./product-detail.css";
import Navbar from "../../components/Navbar";
import config from "../../config/config";
import ReviewBox from "../../components/ReviewBox";
import ProductCard from "../../components/ProductCard";

import {
  MdShoppingCart,
  MdFavoriteBorder,
  MdLocationOn,
  MdCategory,
  MdBusinessCenter,
  MdInventory,
} from "react-icons/md";
import ProductReviews from "../../components/ProductReviews";
import FloatingRecommendButton from "../../components/FloatingRecommendButton";
import WineRecommendationModal from "../../components/WineRecommendationModal";

const ProductDetail = () => {
  const { id } = useParams();
  const storedUser = localStorage.getItem("user");
  const user = JSON.parse(storedUser);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState({});
  const [brands, setBrands] = useState({});
  const [countries, setCountries] = useState({});
  const [materials, setMaterials] = useState({});
  const [reviews, setReviews] = useState([]);
  const [reviewSummary, setReviewSummary] = useState([]);
  const [similarProducts, setSimilarProducts]=useState()
  const [showRecommendations, setShowRecommendations] = useState(false);

  const userId = localStorage.getItem("userId");
  const getSimilarProducts = (product) => {
    if (!product) {
      console.error("Product is null or undefined");
      return; 
    }

    const baseUrl = `${config.BASE_URL}api/v1/products/get-similar-products/`;
    const params = new URLSearchParams();
  
  
    if (product.category) {
      params.append("category", product.category);
    }
    if (product.brand) {
      params.append("brand", product.brand);
    }
    if (product.product_id) {
      params.append("product", product.product_id);
    }
  
    const url = `${baseUrl}?${params.toString()}`;
  
    if (product.category || product.brand) {
      axios
        .get(url)
        .then((response) => {
          setSimilarProducts(response.data); 
        })
        .catch((err) => {
          console.error("Error fetching similar products:", err);
        });
    } else {
      console.warn("No valid category or brand to fetch similar products");
    }
  };
  

useEffect(()=>{
  getSimilarProducts(product)
},[product])
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const [productRes, categoryRes, brandRes, countryRes, materialRes] =
          await Promise.all([
            axios.get(`${config.BASE_URL}api/v1/products/details/${id}/`),
            axios.get(`${config.BASE_URL}api/v1/products/category-list/`),
            axios.get(`${config.BASE_URL}api/v1/products/brand-list/`),
            axios.get(`${config.BASE_URL}api/v1/products/country-list/`),
            axios.get(`${config.BASE_URL}api/v1/products/madeof-list/`),
          ]);

        setProduct(productRes.data);
        setCategories(
          categoryRes.data.reduce(
            (acc, cat) => ({ ...acc, [cat.id]: cat.name }),
            {}
          )
        );
        setBrands(
          brandRes.data.reduce(
            (acc, brand) => ({ ...acc, [brand.brand_id]: brand.name }),
            {}
          )
        );
        setCountries(
          countryRes.data.reduce(
            (acc, country) => ({ ...acc, [country.country_id]: country.name }),
            {}
          )
        );
        setMaterials(
          materialRes.data.reduce(
            (acc, material) => ({
              ...acc,
              [material.madeof_id]: material.name,
            }),
            {}
          )
        );
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
          axios.get(`${config.BASE_URL}api/v1/products/${id}/reviews/`),
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
      const cartResponse = await axios.get(
        `${config.BASE_URL}api/v1/orders/cart-list/?user_id=${userId}`
      );
      let cartId;

      if (cartResponse.data.length > 0) {
        cartId = cartResponse.data[0].cart_id;
      } else {
        const newCartResponse = await axios.post(
          `${config.BASE_URL}api/v1/orders/cart-list/`,
          {
            user_id: userId,
          }
        );
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
      const wishlistResponse = await axios.get(
        `${config.BASE_URL}api/v1/orders/wishlist-list/?user_id=${userId}`
      );
      let wishlistId;

      if (wishlistResponse.data.length > 0) {
        wishlistId = wishlistResponse.data[0].wishlist_id;
      } else {
        const newWishlistResponse = await axios.post(
          `${config.BASE_URL}api/v1/orders/wishlist-list/`,
          {
            user_id: userId,
          }
        );
        wishlistId = newWishlistResponse.data.wishlist_id;
      }

      await axios.post(
        `${config.BASE_URL}api/v1/orders/wishlist-items-create/`,
        {
          wishlist_id: wishlistId,
          product_id: productId,
        }
      );

      alert("Product added to wishlist!");
    } catch (error) {
      if (
        error.response?.data?.error === "Product is already in the wishlist"
      ) {
        alert("Product is already in the wishlist.");
      } else {
        alert("Error adding product to wishlist!");
      }
    }
  };

  if (loading)
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading product details...</p>
      </div>
    );

  if (error)
    return (
      <div className="error-container">
        <p>Error: {error}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );

  if (!product)
    return (
      <div className="not-found-container">
        <h2>Product Not Found</h2>
        <p>The product you're looking for doesn't exist.</p>
        <a href="/products" className="back-button">
          Back to Products
        </a>
      </div>
    );

  const isOutOfStock = product.stock_quantity === 0;
  const isUnavailable = !product.is_active || isOutOfStock;

  return (
    <div>
{!(user?.is_superuser || user?.is_staff || user?.is_delivery_agent || user?.is_supplier) && <Navbar />}     
      <div className="product-detail-page">
        <nav className="product-detail-breadcrumb">
          {user?.is_superuser ? (
            <>
              <a href="/admin">Admin</a> /{" "}
              <a href="/admin/products">Products</a>
            </>
          ) : user?.is_staff ? (
            <>
              <a href="/staff">Home</a> / <a href="/staff/products">Products</a>
            </>
          ) : user?.is_supplier ? (
            <>
              <a href="/stocks">Home</a> / <a href="/stocks/products">Products</a>
            </>
          ) : (
            <>
              <a href="/products">Products</a> / {product.name}
            </>
          )}
        </nav>

        <div className="product-detail-container">
          <div className="product-detail-image-container">
            <img
              src={
                product.image
                  ? `${config.BASE_URL}${product.image}`
                  : "https://via.placeholder.com/400"
              }
              alt={product.name}
              className="product-detail-image"
            />
          </div>

          <div className="product-detail-info">
            <h1 className="product-detail-name">{product.name}</h1>
            <p className="product-detail-price">
              ₹ {product.price.toLocaleString()}
            </p>

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
              <p
                className={`product-detail-stock ${
                  isOutOfStock ? "out-of-stock" : ""
                }`}
              >
                <strong>In Stock:</strong>{" "}
                {isOutOfStock ? "Out of Stock" : product.stock_quantity}
              </p>
            </div>

            {reviewSummary.product_id && (
              <div className="review-summary-section">
                <ReviewBox feedbackSummaryProd={reviewSummary} />
              </div>
            )}

{!(user?.is_superuser || user?.is_staff || user?.is_delivery_agent || user?.is_supplier) &&

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
}

            {isUnavailable && (
              <p className="product-unavailable-message">
                {isOutOfStock
                  ? "This product is out of stock."
                  : "This product is currently unavailable."}
              </p>
            )}
          </div>
          <div>
            <h5>Customer Reviews</h5>
            <ProductReviews reviews={reviews} />
          </div>

          {!(user?.is_superuser || user?.is_staff || user?.is_delivery_agent || user?.is_supplier) && (
            <div className="product-review-container">
              <h2>Similar Products</h2>
              <div className="similar-products-grid-container">
                <ProductCard
                  products={similarProducts?.products}
                  feedbackSummaries={[]}
                  addToWishlist={addToWishlist}
                  addToCart={addToCart}
                />
              </div>
            </div>
          )}
        </div>
      </div>
      {user && (
        <>
          <FloatingRecommendButton
            onClick={() => setShowRecommendations(true)}
          />
          <WineRecommendationModal
            visible={showRecommendations}
            onClose={() => setShowRecommendations(false)}
          />
        </>
      )}
    </div>
  );
};

export default ProductDetail;
