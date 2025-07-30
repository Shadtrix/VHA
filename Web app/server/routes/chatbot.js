const express = require("express");
const router = express.Router();
const { callClaudeChatbot } = require("../utils/chatbotClaude");

router.post("/", async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: "Message is required" });

  try {
    const reply = await callClaudeChatbot(message);
    res.json({ reply });
  } catch (err) {
    console.error(" Chatbot error:", err.message);
    res.status(500).json({ error: "Failed to get AI response" });
  }
});

module.exports = router;
