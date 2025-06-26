import React, { useState } from "react";
import "./StarRating.css";

const StarRating = ({ value, onChange }) => {
  const [hovered, setHovered] = useState(null);

  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((starValue) => (
        <span
          key={starValue}
          className={`star ${
            (hovered || value) >= starValue ? "filled" : ""
          }`}
          onMouseEnter={() => setHovered(starValue)}
          onMouseLeave={() => setHovered(null)}
          onClick={() => onChange(starValue)}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default StarRating;
