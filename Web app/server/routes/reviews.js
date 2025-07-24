const express = require("express");
const router = express.Router();
const { Review, ModerationReview } = require("../models");
const moderateReviewWithBedrock = require("../utils/moderateReview");


// POST /api/reviews
router.post("/", async (req, res) => {
  try {
    const { name, company, description, service, rating } = req.body;

    // Use Bedrock AI moderation
    const { featured, reason } = await moderateReviewWithBedrock(rating, description);

    // Create the review with moderated "featured"
    const review = await Review.create({
      name,
      company,
      description,
      service,
      rating,
      featured,
    });

    // Store moderation logs if unfeatured
    if (!featured) {
      await ModerationReview.create({
        reviewId: review.id,
        reason,
      });
    }

    res.json(review);
  } catch (err) {
    console.error("Review submission failed:", err);
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

// PATCH /api/reviews/:id
router.patch("/:id", async (req, res) => {
  const id = req.params.id;
  const updates = req.body;

  console.log("PATCH /reviews/:id updates received:", updates);

  try {
    const review = await Review.findByPk(id);
    if (!review) return res.status(404).json({ error: "Review not found" });

    await review.update(updates);
    res.json(review);
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ error: "Failed to update review" });
  }
});
// GET /api/moderation-log
router.get("/moderation-log", async (req, res) => {
  try {
    const logs = await ModerationReview.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch moderation logs" });
  }
});



module.exports = router;
