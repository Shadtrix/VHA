const express = require("express");
const router = express.Router();
const { google } = require("googleapis");

// Setup Gmail API client
const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

oAuth2Client.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN, // store safely
});

const gmail = google.gmail({ version: "v1", auth: oAuth2Client });

// Fetch messages
router.get("/messages", async (req, res) => {
  try {
    const response = await gmail.users.messages.list({
      userId: "me",
      maxResults: 10,
    });

    const messages = await Promise.all(
      response.data.messages.map(async (msg) => {
        const fullMsg = await gmail.users.messages.get({
          userId: "me",
          id: msg.id,
        });

        const subjectHeader = fullMsg.data.payload.headers.find(
          (h) => h.name === "Subject"
        );
        const fromHeader = fullMsg.data.payload.headers.find(
          (h) => h.name === "From"
        );

        return {
          id: msg.id,
          subject: subjectHeader ? subjectHeader.value : "(No Subject)",
          from: fromHeader ? fromHeader.value : "(Unknown Sender)",
          snippet: fullMsg.data.snippet,
        };
      })
    );

    res.json(messages);
  } catch (err) {
    console.error("Error fetching Gmail:", err);
    res.status(500).json({ error: "Failed to fetch Gmail messages" });
  }
});

module.exports = router;
