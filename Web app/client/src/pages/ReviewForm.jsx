import React, { useState, useContext } from "react";
import axios from "axios";
import StarRating from "../components/StarRating";
import "./ReviewForm.css";
import { useNavigate } from "react-router-dom";
import UserContext from "../contexts/UserContext";

const ReviewForm = ({ onAdd = () => { } }) => {
  const { user } = useContext(UserContext);
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    description: "",
    service: "MEP Engineering"
  });
  const [rating, setRating] = useState(3);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToSend = { ...formData, rating };
    try {
      const res = await axios.post("http://localhost:3001/api/reviews", dataToSend);
      onAdd(res.data);
      setFormData({
        name: "",
        company: "",
        description: "",
        service: "MEP Engineering"
      });
      setRating(3);
      alert("Thank you for your review!");
      navigate("/tutorials");
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review, please try again later.");
    }
  };

  if (!user) {
    return (
      <div style={{ padding: "2rem", textAlign: "center", fontWeight: "bold", color: "#b71c1c" }}>
        Please log in to submit a review.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="review-form">
      <h2>Service Review</h2>

      <label htmlFor="name">Your Name</label>
      <input
        id="name"
        name="name"
        type="text"
        value={formData.name || ""}
        onChange={handleChange}
        placeholder="Your name"
        required
      />

      <label htmlFor="company">Your Company Representation</label>
      <input
        id="company"
        name="company"
        type="text"
        value={formData.company || ""}
        onChange={handleChange}
        placeholder="Your company representation"
        required
      />

      <label htmlFor="description">Your Review</label>
      <textarea
        id="description"
        name="description"
        value={formData.description || ""}
        onChange={handleChange}
        placeholder="Your review"
        required
      />

      <label htmlFor="service">Service</label>
      <select
        id="service"
        name="service"
        value={formData.service || ""}
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
