import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ReviewAdmin.css"; // Assuming you have some styles for this component

const ReviewAdmin = () => {
  const [reviews, setReviews] = useState([]);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/reviews");
      if (Array.isArray(res.data)) {
        setReviews(res.data);
      } else {
        console.error("Expected array, got:", res.data);
        setReviews([]); // fallback
      }
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
      setReviews([]); // fallback on error
    }
  };


  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:3001/api/reviews/${id}`);
    fetchReviews(); // refresh list
  };

  const filteredReviews = reviews.filter((review) =>
    filter === "All" ? true : review.service === filter
  );

  return (
    <div className="review-admin-container">
      <h1 className="review-admin-title">Review Management (Admin)</h1>

      <div className="review-admin-filter">
        <label>Filter by service:</label>
        <select
          className="review-admin-select"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="All">All</option>
          <option value="MEP Engineering">MEP Engineering</option>
          <option value="Fire Safety Engineering">Fire Safety Engineering</option>
          <option value="Annual Fire Certification">Annual Fire Certification</option>
          <option value="Registered Inspector Services">Registered Inspector Services</option>
        </select>
      </div>

      <div className="review-admin-list">
        {filteredReviews.length > 0 ? (
          filteredReviews.map((review) => (
            <div key={review.id} className="review-admin-item">
              <div>
                <p className="review-admin-name">
                  {review.name} <span className="review-admin-service">({review.service})</span>
                </p>
                <p className="review-admin-company">
                  {review.company || "N/A"}
                </p>
                <p className="review-admin-rating">
                  Rating: {review.rating} <span className="review-admin-stars">★</span>
                </p>
                <p className="review-admin-description">{review.description}</p>
              </div>
              <button
                className="review-admin-delete-btn"
                onClick={() => handleDelete(review.id)}
              >
                Delete
              </button>
            </div>
          ))
        ) : (
          <p>No reviews found.</p>
        )}
      </div>
    </div>

  );
};

export default ReviewAdmin;
