const express = require("express");
const router = express.Router();
const { Review, ModerationReview } = require("../models");
const moderateReviewWithBedrock = require("../utils/moderateReview");
const ExcelJS = require("exceljs");
const path = require("path");


// POST /api/reviews
router.post("/", async (req, res) => {
  try {
    const { name, company, description, service, rating } = req.body;
    const { featured, reason, constructive } = await moderateReviewWithBedrock(rating, description);

    const review = await Review.create({
      name,
      company,
      description,
      service,
      rating,
      featured,
    });

    if (!featured) {
      await ModerationReview.create({
        reviewId: review.id,
        reason,
        constructive 
      });
    }

    res.json(review);
  } catch (err) {
    console.error("Review submission failed:", err);
    res.status(500).json({ error: "Failed to create review" });
  }
});

router.post('/export-constructive', async (req, res) => {
  const { reviews } = req.body; // Expect an array of review objects

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Constructive Reviews');
  worksheet.columns = [
    { header: "Review ID", key: "reviewId" },
    { header: "Name", key: "name" },
    { header: "Company", key: "company" },
    { header: "Description", key: "description" },
    { header: "Reason", key: "reason" },
    { header: "Rating", key: "rating" },
    { header: "Date", key: "createdAt" },
  ];

  reviews.forEach(r => worksheet.addRow(r));

  res.setHeader(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  );
  res.setHeader(
    'Content-Disposition',
    'attachment; filename=constructive_reviews.xlsx'
  );

  await workbook.xlsx.write(res);
  res.end();
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

router.get("/download-constructive", (req, res) => {
  const filePath = path.join(__dirname, "../constructive_reviews.xlsx");
  res.download(filePath, "constructive_reviews.xlsx", (err) => {
    if (err) {
      res.status(404).send("File not found or not generated yet.");
    }
  });
});



module.exports = router;
