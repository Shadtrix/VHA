const express = require("express");
const router = express.Router();
const { Email } = require("../models");

// GET all emails
router.get('/', async (req, res) => {
  try {
    const emails = await Email.findAll();
    res.json(emails);
  } catch (err) {
    console.error("Failed to fetch emails:", err);
    res.status(500).json({ error: "Failed to fetch emails" });
  }
});

// GET one email by ID
router.get('/:id', async (req, res) => {
  try {
    const email = await Email.findByPk(req.params.id);
    if (!email) return res.status(404).json({ error: 'Email not found' });
    res.json(email);
  } catch (err) {
    console.error("Failed to fetch email by ID:", err);
    res.status(500).json({ error: "Failed to fetch email" });
  }
});

// ✅ POST: Create a new email
router.post('/create', async (req, res) => {
  try {
    const { sender, email, subject, body, date } = req.body;
    const newEmail = await Email.create({ sender, email, subject, body, date });
    res.status(201).json(newEmail);
  } catch (err) {
    console.error("Error creating email:", err);
    res.status(500).json({ error: "Failed to create email" });
  }
});

module.exports = router;
