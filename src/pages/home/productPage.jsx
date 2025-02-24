import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/Navbar";
import Filter from "../../components/Filters";
import ProductCard from "../../components/ProductCard";
import "./product.css";
import config from "../../config/config";
import FloatingRecommendButton from "../../components/FloatingRecommendButton";
import WineRecommendationModal from "../../components/WineRecommendationModal";

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // States for filters
  const [category, setCategory] = useState("all");
  const [brand, setBrand] = useState("all");
  const [country, setCountry] = useState("all");
  const [madeOf, setMadeOf] = useState("all");
  const [sortOrder, setSortOrder] = useState("default");

  const [feedbackSummaries, setFeedbackSummaries] = useState();
  const location = useLocation();

  const BASE_URL = "http://127.0.0.1:8000";
  const userId = localStorage.getItem("userId"); // Get the logged-in user ID from localStorage

  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get("search") || "";
  const [showRecommendations, setShowRecommendations] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${config.BASE_URL}api/v1/products/list/?search=${searchQuery}`
        );
        console.log("Fetched Products:", response.data); // Debug log
        setProducts(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching products:", err); // Debug log
        setError("Failed to fetch products");
        setLoading(false);
      }
    };

    console.log("Search Query:", searchQuery); // Debug log
    fetchProducts();
  }, [BASE_URL, searchQuery]);

  // Fetch products based on filters or search query
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${config.BASE_URL}api/v1/products/filter/`,
        {
          params: {
            category: category !== "all" ? category : null,
            brand: brand !== "all" ? brand : null,
            country: country !== "all" ? country : null,
            made_of: madeOf !== "all" ? madeOf : null,
            sort: sortOrder !== "default" ? sortOrder : null,
          },
        }
      );
      setProducts(response.data);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  // Fetch products on initial load or when filters change
  useEffect(() => {
    fetchProducts();
  }, [category, brand, country, madeOf, sortOrder]);

  useEffect(() => {
    const fetchFeedbackSummaries = async () => {
      const summaries = [];
      for (const item of products) {
        try {
          const response = await axios.get(
            `${config.BASE_URL}api/v1/products/${item.product_id}/review-summary/`
          );
          console.log("feedback response", response);
          summaries.push(response.data.data);
        } catch (error) {
          console.error(
            `Failed to fetch feedback for product ${item.product_id}:`,
            error
          );
        }
      }
      setFeedbackSummaries(summaries);
    };

    fetchFeedbackSummaries();
  }, [products]);

  const addToCart = (productId, quantity = 1) => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("Please log in first to add items to the cart.");
      return;
    }
    console.log(userId);

    axios
      .get(`${config.BASE_URL}api/v1/orders/cart-list/?user_id=${userId}`)
      .then((response) => {
        let cartId;

        if (response.data.length > 0) {
          cartId = response.data[0].cart_id; // Assuming first cart for the user
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
        if (
          error.response &&
          error.response.data &&
          error.response.data.error === "Product is already in the wishlist"
        ) {
          alert("Product is already in the wishlist.");
        } else {
          alert("Error adding product to wishlist!");
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
            : "Discover Our Premium Products"}
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
                <ProductCard
                  products={products}
                  feedbackSummaries={feedbackSummaries}
                  addToWishlist={addToWishlist}
                  addToCart={addToCart}
                />
              ) : (
                <p>No products found for "{searchQuery}"</p>
              )}
            </div>
          </div>
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

export default ProductPage;
