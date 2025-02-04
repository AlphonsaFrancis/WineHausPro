import React, { useState, useEffect } from "react";
import { Star } from "lucide-react";
import "./WriteProductReview.css";
import config from "../config/config";

const WriteProductReview = ({ productId, orderId, existingReview }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const storedUser = localStorage.getItem("user");
  const user = JSON.parse(storedUser);

  // Initialize form fields if an existing review is provided
  useEffect(() => {
    if (existingReview) {
      setRating(existingReview.rating || 0);
      setComment(existingReview.comment || "");
    }
  }, [existingReview]);
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!rating) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(
        existingReview
          ? `${config.BASE_URL}api/v1/products/edit-review/${existingReview.id}/user/${user.id}/`
          : `${config.BASE_URL}api/v1/products/reviews/create/`,
        {
          method: existingReview ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            product_id: productId,
            user_email: user?.email ?? null,
            order_id: orderId,
            rating,
            comment,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit review");
      }

      // Reset form for new review or indicate success
      if (!existingReview) {
        setRating(0);
        setComment("");
        setIsHovered(false);
      }
    } catch (error) {
      console.error("Error submitting review:", error);
    } finally {
      setIsSubmitting(false);
      window.location.reload();
    }
  };

  return (
    <div
      className="review-container"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => !rating && !comment && setIsHovered(false)}
    >
      {!isHovered && !existingReview ? (
        <div className="review-prompt">Write a review...</div>
      ) : (
        <form onSubmit={handleSubmit} className="review-form">
          {/* Rating Stars */}
          <div className="star-container">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="star-button"
              >
                <Star
                  size={24}
                  className={
                    star <= (hoveredRating || rating)
                      ? "star-filled"
                      : "star-empty"
                  }
                />
              </button>
            ))}
          </div>

          {/* Review Text */}
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your review here..."
            className="review-textarea"
          />

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || !rating}
            className={`submit-button ${isSubmitting ? "submitting" : ""}`}
          >
            {isSubmitting
              ? "Submitting..."
              : existingReview
              ? "Update"
              : "Submit"}
          </button>
        </form>
      )}
    </div>
  );
};

export default WriteProductReview;
