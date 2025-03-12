import React from "react";
import "../pages/home/product.css";
import config from "../config/config";
import ReviewBox from "./ReviewBox";

function ProductCard({
  products,
  feedbackSummaries,
  addToWishlist,
  addToCart,
}) {
  console.log("products",products)
  return (
    <>
      {products?.map((product) => (
        <div className="hard-product-card" key={product.product_id}>
          <a
            href={`/products/${product.product_id}`}
            className="hard-product-link"
          >
            <img
              src={
                product.image
                  ? `${config.BASE_URL}${product.image}`
                  : "https://via.placeholder.com/150"
              }
              alt={product.name}
              className="hard-product-image"
            />
            <div className="hard-product-info">
              <h4>{product.name}</h4>
              <p className="hard-price">₹ {product.price}</p>
            </div>
            {product.stock_quantity <= 0 && (
              <p className="hard-out-of-stock-label">Out of Stock</p>
            )}

            {feedbackSummaries?.map((item) =>
              item?.product_id === product.product_id ? (
                <ReviewBox key={item.product_id} feedbackSummaryProd={item} />
              ) : null
            )}
          </a>
          <div className="hard-product-actions">
            <button
              className="hard-wishlist-btn"
              onClick={() => addToWishlist(product.product_id)}
            >
              <i className="fas fa-heart"></i> Wishlist
            </button>
            <button
              className="hard-cart-btn"
              disabled={product.stock_quantity <= 0}
              onClick={() => addToCart(product.product_id)}
            >
              <i className="fas fa-shopping-cart"></i> Add to Cart
            </button>
          </div>
        </div>
      ))}
    </>
  );
}

export default ProductCard;
