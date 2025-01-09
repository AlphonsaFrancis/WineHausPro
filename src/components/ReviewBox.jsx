import React from "react";

import { IoStar } from "react-icons/io5";
import { IoStarOutline } from "react-icons/io5";
import { FaRegSmile } from "react-icons/fa";
import { MdOutlineSentimentNeutral } from "react-icons/md";
import { TbMoodSad } from "react-icons/tb";

function ReviewBox({ feedbackSummaryProd, ratingText }) {

  console.log("feedbackSummaryProd",feedbackSummaryProd)
  return (
    <div>
      <div className="feedback-container" key={feedbackSummaryProd?.product_id}>
        <div className="rating-container">
          <div className="rating">
            {ratingText ? ratingText : "Rating"}{" "}
            <span style={{ color: "red" }}>
              {feedbackSummaryProd?.average_rating}
            </span>
          </div>
          <div className="stars">
            {Array.from({ length: 5 }, (_, i) =>
              i < Math.floor(feedbackSummaryProd?.average_rating) ? (
                <IoStar key={i} />
              ) : i < feedbackSummaryProd?.average_rating ? (
                <IoStarOutline key={i} />
              ) : (
                <IoStarOutline key={i} />
              )
            )}
          </div>
        </div>
        <div className="emoji">
          {(() => {
            const sentiment = feedbackSummaryProd?.sentiment_summary;
            const positive = parseFloat(sentiment?.Positive || "0");
            const neutral = parseFloat(sentiment?.Neutral || "0");
            const negative = parseFloat(sentiment?.Negative || "0");

            // Determine the dominant sentiment
            if (positive >= neutral && positive >= negative) {
              return (
                <span style={{ color: "green" }}>
                  <FaRegSmile />
                </span>
              );
            } else if (neutral >= positive && neutral >= negative) {
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
          })()}
        </div>
      </div>
    </div>
  );
}

export default ReviewBox;
