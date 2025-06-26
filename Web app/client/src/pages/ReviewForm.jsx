import React, { useState } from "react";
import axios from "axios";
import StarRating from "../components/StarRating";
import "./ReviewForm.css";

const ReviewForm = ({ onAdd = () => {} }) => {
  const [formData, setFormData] = useState({ name: "", description: "", service: "MEP Engineering" });
  const [rating, setRating] = useState(3);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToSend = { ...formData, rating };
    try {
      const res = await axios.post("/api/reviews", dataToSend);
      onAdd(res.data);
      setFormData({ name: "", description: "", service: "MEP Engineering" });
      setRating(3);
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review, please try again later.");
    }
  };

  return (
    
    <form onSubmit={handleSubmit} className="review-form">
      <h>Service Review</h>
      <label htmlFor="name">Your Name</label>
      <input
        id="name"
        name="name"
        type="text"
        value={formData.name}
        onChange={handleChange}
        placeholder="Your name"
        required
      />

      <label htmlFor="rep">Your Company Representation</label>
      <input
        id="rep"
        name="rep"
        type="text"
        value={formData.rep}
        onChange={handleChange}
        placeholder="Your company representation"
        required
        />

      <label htmlFor="description">Your Review</label>
      <textarea
        id="description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Your review"
        required
      />

      <label htmlFor="service">Service</label>
      <select
        id="service"
        name="service"
        value={formData.service}
        onChange={handleChange}
      >
        <option>MEP Engineering</option>
        <option>Fire Safety Engineering</option>
        <option>Annual Fire Certification</option>
        <option>Registered Inspector Services</option>
      </select>

      <div className="star-rating-container">
        <label>Rating</label>
        <StarRating value={rating} onChange={setRating} />
      </div>

      <button type="submit">Submit Review</button>
    </form>
  );
};

export default ReviewForm;
