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
    const res = await axios.get("/api/reviews");
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
    await axios.delete(`/api/reviews/${id}`);
    fetchReviews(); // refresh list
  };

  const filteredReviews = reviews.filter((review) =>
    filter === "All" ? true : review.service === filter
  );

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Review Management (Admin)</h1>

      <div className="mb-4">
        <label className="font-medium mr-2">Filter by service:</label>
        <select
          className="border p-2"
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

      <div className="space-y-4">
        {filteredReviews.length > 0 ? (
          filteredReviews.map((review) => (
            <div
              key={review.id}
              className="border rounded p-4 bg-gray-100 flex justify-between items-start"
            >
              <div>
                <p className="font-bold">{review.name} <span className="text-sm text-gray-500">({review.service})</span></p>
                <p className="text-gray-700 mt-1">{review.description}</p>
              </div>
              <button
                className="ml-4 text-red-500 hover:underline"
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
