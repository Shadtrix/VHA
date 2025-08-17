const express = require("express");
const router = express.Router();
const { callClaude } = require("../utils/claude.js");
const { Email } = require("../models");
const { google } = require("googleapis");
const { listEmails } = require("../utils/Gmail_API.js");

const auth = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);
auth.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });
const gmail = google.gmail({ version: "v1", auth });

router.get('/', async (req, res) => {
  try {
    const dbEmails = await Email.findAll();

    const gmailEmails = await listEmails();

    const mappedGmailEmails = gmailEmails.map((e) => ({
      id: `gmail-${e.id}`,
      gmailId: e.id,
      sender: e.from,
      email: e.from,
      subject: e.subject,
      body: e.body,
      date: new Date(e.date),
      translated: false,
      summarised: false,
      autoResponse: false,
    }));

    const allEmails = [...dbEmails, ...mappedGmailEmails];

    allEmails.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json(allEmails);
  } catch (err) {
    console.error("Failed to fetch combined emails:", err);
    res.status(500).json({ error: "Failed to fetch emails" });
  }
});

router.get('/:id', async (req, res) => {
  const id = req.params.id;

  try {
    if (id.startsWith("gmail-")) {
      // Gmail email
      const gmailId = id.replace(/^gmail-/, '');
      const gmail = google.gmail({ version: 'v1', auth });

      try {
        const gmailRes = await gmail.users.messages.get({
          userId: 'me',
          id: gmailId,
          format: 'full',
        });

        const headers = gmailRes.data.payload.headers;
        const subject = headers.find(h => h.name === 'Subject')?.value || '(no subject)';
        const from = headers.find(h => h.name === 'From')?.value || '';
        const dateStr = headers.find(h => h.name === 'Date')?.value || '';
        const date = dateStr ? new Date(dateStr) : null;

        // Extract body
        let body = '';
        const parts = gmailRes.data.payload.parts;
        if (parts && parts.length) {
          const plainPart = parts.find(p => p.mimeType === 'text/plain');
          const htmlPart = parts.find(p => p.mimeType === 'text/html');

          if (plainPart?.body?.data) {
            body = Buffer.from(plainPart.body.data, 'base64').toString('utf-8');
          } else if (htmlPart?.body?.data) {
            body = Buffer.from(htmlPart.body.data, 'base64').toString('utf-8');
          }
        } else if (gmailRes.data.payload.body?.data) {
          body = Buffer.from(gmailRes.data.payload.body.data, 'base64').toString('utf-8');
        } else {
          body = gmailRes.data.snippet || '';
        }

        return res.json({
          id: `gmail-${gmailId}`,
          gmailId,
          sender: from,
          subject,
          body,
          date,
        });

      } catch (gmailErr) {
        console.error("Failed to fetch Gmail email:", gmailErr);
        return res.status(404).json({ error: 'Gmail email not found' });
      }

    } else {
      // DB email
      const email = await Email.findByPk(id);
      if (!email) return res.status(404).json({ error: 'Email not found' });
      return res.json(email);
    }

  } catch (err) {
    console.error("Failed to fetch email by ID:", err);
    return res.status(500).json({ error: "Failed to fetch email" });
  }
});

router.post('/create', async (req, res) => {
  try {
    const { sender, email, subject, body, date, translated, summarised, autoResponse } = req.body;
    const newEmail = await Email.create({ sender, email, subject, body, date, translated, summarised, autoResponse });
    res.status(201).json(newEmail);
  } catch (err) {
    console.error("Error creating email:", err);
    res.status(500).json({ error: "Failed to create email" });
  }
});

router.delete('/:id', async (req, res) => {
  const id = req.params.id;

  try {
    if (id.startsWith("gmail-")) {
      const gmailId = id.replace(/^gmail-/, "");
      const gmail = google.gmail({ version: "v1", auth }); // use imported auth

      console.log("Deleting Gmail email:", gmailId);
      await gmail.users.messages.delete({
        userId: "me",
        id: gmailId,
      });

      return res.json({ success: true, message: "Deleted from Gmail" });
    } else {
      const email = await Email.findByPk(id);
      if (!email) return res.status(404).json({ error: "Email not found" });

      await email.destroy();
      return res.json({ success: true, message: "Deleted from DB" });
    }
  } catch (err) {
    console.error("Failed to delete email:", err);
    return res.status(500).json({ error: "Failed to delete email" });
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

router.post("/translate/:id", async (req, res) => {
  try {
    const email = await Email.findByPk(req.params.id);
    if (!email) return res.status(404).json({ error: "Email not found" });

    const translatedText = await callClaude(`Translate this email to English:\n\n${email.body}`);

    const newEmail = await Email.create({
      sender: email.sender,
      email: email.email,
      subject: `[Translated] ${email.subject}`,
      body: `📘 Translated version:\n\n${translatedText}`,
      date: new Date(),
      translated: true,
    });

    res.json(newEmail);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to translate email" });
  }
});

router.post("/summarise/:id", async (req, res) => {
  try {
    const email = await Email.findByPk(req.params.id);
    if (!email) return res.status(404).json({ error: "Email not found" });

    const summary = await callClaude(`Summarise this email:\n\n${email.body}`);

    const newEmail = await Email.create({
      sender: email.sender,
      email: email.email,
      subject: `[Summary] ${email.subject}`,
      body: `📝 Summary:\n\n${summary}`,
      date: new Date(),
      summarised: true,
    });

    res.json(newEmail);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to summarise email" });
  }
});

router.post("/respond/:id", async (req, res) => {
  try {
    const email = await Email.findByPk(req.params.id);
    if (!email) return res.status(404).json({ error: "Email not found" });

    const responseText = await callClaude(`Write a professional response to this email:\n\n${email.body}`);

    const newEmail = await Email.create({
      sender: "Auto Response System",
      email: "no-reply@system.com",
      subject: `[Response to] ${email.subject}`,
      body: `✨ Autogenerated Response:\n\n${responseText}`,
      date: new Date(),
      autoResponse: true,
    });

    res.json(newEmail);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate response" });
  }
});




module.exports = router;
