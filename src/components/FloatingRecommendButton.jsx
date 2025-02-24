import React from "react";
import { Brain } from "lucide-react";
import "./FloatingRecommendButton.css";

const FloatingRecommendButton = ({ onClick }) => {
  return (
    <button className="floating-gemini-button" onClick={onClick}>
      {/* Outer ripple effect circles */}
      <div className="ripple-container">
        <div className="ripple"></div>
        <div className="ripple"></div>
        <div className="ripple"></div>
      </div>

      <div className="button-content">
        {/* Gemini star shape */}
        <svg
          className="gemini-star"
          viewBox="0 0 512 512"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient
              id="geminiGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" style={{ stopColor: "#8B5CF6" }} />
              <stop offset="100%" style={{ stopColor: "#3B82F6" }} />
            </linearGradient>
          </defs>
          <path
            d="M256 64C176 64 64 176 64 256C64 336 176 448 256 448C336 448 448 336 448 256C448 176 336 64 256 64"
            fill="url(#geminiGradient)"
          />
        </svg>

        {/* Inner floating dots */}
        <div className="inner-dots">
          <div className="dot dot-1"></div>
          <div className="dot dot-2"></div>
          <div className="dot dot-3"></div>
          <div className="dot dot-4"></div>
        </div>
      </div>
    </button>
  );
};

export default FloatingRecommendButton;
