import React, { useState } from "react";
import "./StarRating.css";

const StarRating = ({ value, onChange }) => {
  const [hovered, setHovered] = useState(null);

  return (
    <div className="star-rating">
      {[...Array(5)].map((_, i) => {
        const starValue = i + 1;
        const isFilled = starValue <= value;
        const isHovered = starValue <= hovered;

        return (
          <span
            key={starValue}
            className={`star ${isFilled ? "filled" : ""} ${isHovered ? "hovered" : ""}`}
            onMouseEnter={() => setHovered(starValue)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => onChange(starValue)}
          >
            ★
          </span>
        );
      })}
    </div>
  );
};

export default StarRating;
