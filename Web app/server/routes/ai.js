const express = require('express');
const axios = require('axios');
require('dotenv').config();

const router = express.Router();

router.post('/password', async (req, res) => {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: "Generate a secure, memorable password with at least one number and one symbol. Keep it under 20 characters.",
          },
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    const password = response.data.choices[0].message.content.trim();
    res.json({ password });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate password' });
  }
});

module.exports = router;
