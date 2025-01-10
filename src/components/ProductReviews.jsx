import React from "react";
import {
  MdStar,
  MdStarBorder,
  MdThumbUp,
  MdCalendarToday,
  MdPerson,
} from "react-icons/md";
import "./ProductReviews.css";

const ProductReviews = ({ reviews }) => {
  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) =>
      index < rating ? (
        <MdStar key={index} className="star-filled" size={14} />
      ) : (
        <MdStarBorder key={index} className="star-empty" size={14} />
      )
    );
  };

  return (
    <div className="reviews-container">
      {reviews.map((review, index) => (
        <div key={index} className="review-card">
          <div className="user-section">
            <div className="avatar">
              <MdPerson className="avatar-icon" />
            </div>
            <div className="user-details">
              <h3 className="username">{review?.user || "Anonymous"}</h3>
              <div className="rating">{renderStars(review?.rating)}</div>
            </div>
          </div>

          <div className="review-section">
            <p className="review-content">{review?.comment}</p>
            <div className="review-footer">
              <span className="review-date">
                <MdCalendarToday className="calendar-icon" />
                {formatTimestamp(review?.updated_at)}
              </span>
              {/* <button className="helpful-button">
                <MdThumbUp className="thumb-icon" />
                <span className="helpful-count">0</span>
              </button> */}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductReviews;
