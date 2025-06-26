const express = require("express");
const router = express.Router();
const { Review } = require("../models");

// POST /api/reviews
router.post("/", async (req, res) => {
  try {
    const { name, company, description, service, rating } = req.body;
    const review = await Review.create({ name, company, description, service, rating });
    res.json(review);
  } catch (err) {
    res.status(500).json({ error: "Failed to create review" });
  }
});

// GET /api/reviews
router.get("/", async (req, res) => {
  const reviews = await Review.findAll({ order: [["createdAt", "DESC"]] });
  res.json(reviews);
});

// DELETE /api/reviews/:id
router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  await Review.destroy({ where: { id } });
  res.json({ message: "Deleted successfully" });
});

module.exports = router;
