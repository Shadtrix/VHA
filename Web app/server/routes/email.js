const express = require("express");
const router = express.Router();
const { Email } = require("../models");


router.get('/', async (req, res) => {
  try {
    const emails = await Email.findAll();
    res.json(emails);
  } catch (err) {
    console.error("Failed to fetch emails:", err);
    res.status(500).json({ error: "Failed to fetch emails" });
  }
});

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

router.post('/create', async (req, res) => {
  try {
    const { sender, email, subject, body, date, translated, summarised, autoResponse } = req.body;
    const newEmail = await Email.create({ sender, email, subject, body, date, translated, summarised, autoResponse});
    res.status(201).json(newEmail);
  } catch (err) {
    console.error("Error creating email:", err);
    res.status(500).json({ error: "Failed to create email" });
  }
});
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Email.destroy({ where: { id: req.params.id } });
    if (deleted) return res.json({ message: 'Email deleted' });
    return res.status(404).json({ error: 'Email not found' });
  } catch (err) {
    console.error("Failed to delete email:", err);
    res.status(500).json({ error: "Failed to delete email" });
  }
});
router.put('/:id', async (req, res) => {
  try {
    const { sender, email, subject, body, date } = req.body;
    const [updated] = await Email.update(
      { sender, email, subject, body, date },
      { where: { id: req.params.id } }
    );
    if (updated) return res.json({ message: 'Email updated' });
    res.status(404).json({ error: 'Email not found' });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ error: 'Failed to update email' });
  }
});




module.exports = router;
