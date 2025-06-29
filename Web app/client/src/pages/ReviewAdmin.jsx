import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ReviewAdmin.css";

const ReviewAdmin = () => {
  const [reviews, setReviews] = useState([]);
  const [filter, setFilter] = useState("All");
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    company: "",
    description: "",
    service: "",
    rating: 5
  });

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/reviews");
      if (Array.isArray(res.data)) {
        setReviews(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
    }
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:3001/api/reviews/${id}`);
    fetchReviews();
  };

  const handleEditClick = (review) => {
    setEditingReviewId(review.id);
    setEditForm({
      name: review.name,
      company: review.company,
      description: review.description,
      service: review.service,
      rating: review.rating
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await axios.patch(`http://localhost:3001/api/reviews/${editingReviewId}`, editForm);
      setEditingReviewId(null);
      fetchReviews();
    } catch (err) {
      console.error("Failed to update review:", err);
    }
  };

  const handleToggleFeatured = async (id, newValue) => {
    console.log(`Toggling featured for id=${id} to ${newValue}`);

    setReviews(prev =>
      prev.map(r => (r.id === id ? { ...r, featured: newValue } : r))
    );

    try {
      await axios.patch(`http://localhost:3001/api/reviews/${id}`, { featured: newValue });
      fetchReviews();
    } catch (err) {
      console.error("Failed to update review:", err);
    }
  };


  const filteredReviews = reviews.filter((r) =>
    filter === "All" ? true : r.service === filter
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
              {editingReviewId === review.id ? (
                <div className="review-edit-form">
                  <input
                    type="text"
                    name="name"
                    value={editForm.name}
                    onChange={handleEditChange}
                    placeholder="Name"
                  />
                  <input
                    type="text"
                    name="company"
                    value={editForm.company}
                    onChange={handleEditChange}
                    placeholder="Company"
                  />
                  <textarea
                    name="description"
                    value={editForm.description}
                    onChange={handleEditChange}
                    placeholder="Description"
                  />
                  <select name="service" value={editForm.service} onChange={handleEditChange}>
                    <option>MEP Engineering</option>
                    <option>Fire Safety Engineering</option>
                    <option>Annual Fire Certification</option>
                    <option>Registered Inspector Services</option>
                  </select>
                  <input
                    type="number"
                    name="rating"
                    min="1"
                    max="5"
                    value={editForm.rating}
                    onChange={handleEditChange}
                  />
                  <button onClick={handleSave} className="review-admin-save-btn">Save</button>
                </div>
              ) : (
                <div>
                  <p className="review-admin-name">
                    {review.name} <span className="review-admin-service">({review.service})</span>
                  </p>
                  <p className="review-admin-company">{review.company || "N/A"}</p>
                  <p className="review-admin-rating">
                    Rating: {review.rating} <span className="review-admin-stars">★</span>
                  </p>
                  <p className="review-admin-description">{review.description}</p>
                </div>
              )}

              <div className="review-admin-controls">
                <div className="review-admin-actions">
                  <button className="review-admin-edit-btn" onClick={() => handleEditClick(review)}>Edit</button>
                  <button className="review-admin-delete-btn" onClick={() => handleDelete(review.id)}>Delete</button>
                  <label className="feature-toggle">
                    <input
                      type="checkbox"
                      checked={!!review.featured}
                      onChange={(e) => handleToggleFeatured(review.id, e.target.checked)}
                    />
                    <span className="feature-label">
                      Featured{" "}
                      {review.featured && (
                        <span style={{ fontStyle: "italic", fontSize: "0.875rem", color: "#6b7280" }}>
                          ({review.service})
                        </span>
                      )}
                    </span>

                  </label>
                </div>

              </div>
            </div>
          ))
        ) : (
          <p>No reviews found.</p>
        )}
      </div>
    </div >
  );
};

export default ReviewAdmin;
