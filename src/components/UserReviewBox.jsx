import React from "react";

import { IoStar } from "react-icons/io5";
import { IoStarOutline } from "react-icons/io5";
import { FaRegSmile } from "react-icons/fa";
import { MdOutlineSentimentNeutral } from "react-icons/md";
import { TbMoodSad } from "react-icons/tb";

function UserReviewBox({ reviewData }) {
  const { rating, comment } = reviewData || {};

  // Determine sentiment based on rating
  const getSentimentIcon = (rating) => {
    if (rating >= 4) {
      return (
        <span style={{ color: "green" }}>
          <FaRegSmile />
        </span>
      );
    } else if (rating === 3) {
      return (
        <span style={{ color: "yellow" }}>
          <MdOutlineSentimentNeutral />
        </span>
      );
    } else {
      return (
        <span style={{ color: "red" }}>
          <TbMoodSad />
        </span>
      );
    }
  };

  return (
    <div>
      <div className="feedback-container" key={reviewData?.id}>
        <div className="rating-container">
          <div className="rating">
            Rating:{" "}
            <span style={{ color: "red" }}>{rating ? rating : "N/A"}</span>
          </div>
          <div className="stars">
            {Array.from({ length: 5 }, (_, i) =>
              i < rating ? <IoStar key={i} /> : <IoStarOutline key={i} />
            )}
          </div>
        </div>
        <div className="emoji">{getSentimentIcon(rating)}</div>
        <div className="rating">
          <strong>Comment:</strong> {comment || "No comments provided."}
        </div>
      </div>
    </div>
  );
}

export default UserReviewBox;
