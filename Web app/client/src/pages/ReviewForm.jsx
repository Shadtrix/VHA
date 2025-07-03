import React, { useState } from "react";
import axios from "axios";
import StarRating from "../components/StarRating";
import "./ReviewForm.css";
import { useNavigate } from "react-router-dom";

const ReviewForm = ({ onAdd = () => {} }) => {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    description: "",
    service: "MEP Engineering",
  });
  const [rating, setRating] = useState(3);
  const [error, setError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "description") {
      if (value.length > 1000) {
        setError("Input exceeds max of 1000 characters");
      } else {
        setError("");
        setSubmitError(""); // clear on input
      }
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.description.length > 1000) {
      setSubmitError("Cannot submit: Review exceeds 1000 characters limit.");
      return;
    }

    setSubmitError("");

    const dataToSend = { ...formData, rating };
    try {
      const res = await axios.post("http://localhost:3001/api/reviews", dataToSend);
      onAdd(res.data);
      setFormData({
        name: "",
        company: "",
        description: "",
        service: "MEP Engineering",
      });
      setRating(3);
      alert("Thank you for your review!");
      navigate("/tutorials");
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review, please try again later.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="review-form">
      <h>Service Review</h>

      <p>Please write a review to tell us about the things we did well, the things we need improvement on and other general comments.</p>

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

      <label htmlFor="company">Your Company Representation</label>
      <input
        id="company"
        name="company"
        type="text"
        value={formData.company}
        onChange={handleChange}
        placeholder="Your company representation"
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

      <label htmlFor="description">Your Review</label>
      <textarea
        id="description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Your review (max 1000 characters)"
        required
        className={error ? "error" : ""}
        aria-describedby="description-error"
      />
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: "1rem",
          fontSize: "0.85rem",
          marginTop: 4,
          color: error ? "red" : "inherit",
          alignItems: "center",
        }}
      >
        {error && <div id="description-error">{error}</div>}
        <div>{formData.description.length} characters</div>
      </div>

      {/* Submit-level error message */}
      {submitError && (
        <div
          style={{
            color: "red",
            fontWeight: "600",
            fontSize: "0.9rem",
            textAlign: "center",
            marginBottom: "0.8rem",
          }}
        >
          {submitError}
        </div>
      )}

      <button type="submit" disabled={!!error || !!submitError}>
        Submit Review
      </button>
    </form>
  );
};

export default ReviewForm;
