const express = require("express");
const router = express.Router();
const { Review } = require("../models");

// Create review
router.post("/", async (req, res) => {
  try {
    const { name, description, service } = req.body;
    const review = await Review.create({ name, description, service });
    res.json(review);
  } catch (err) {
    res.status(500).json({ error: "Failed to create review" });
  }
});

// Get all reviews
router.get("/", async (req, res) => {
  const reviews = await Review.findAll({ order: [["createdAt", "DESC"]] });
  res.json(reviews);
});

// Delete review
router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  await Review.destroy({ where: { id } });
  res.json({ message: "Deleted successfully" });
});
