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

  // Helper to extract email from "Name <email@domain.com>"
  const extractEmail = (str) => {
    const match = str.match(/<(.+)>/);
    return match ? match[1] : str;
  };

  try {
    if (id.startsWith("gmail-")) {
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
        const fromHeader = headers.find(h => h.name === 'From')?.value || '';
        const toHeader = headers.find(h => h.name === 'To')?.value || '';
        const senderEmail = extractEmail(fromHeader);
        const recipientEmail = extractEmail(toHeader);

        const dateStr = headers.find(h => h.name === 'Date')?.value || '';
        const date = dateStr ? new Date(dateStr) : null;

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

        // Save to DB if not already saved
        let dbEmail = await Email.findOne({ where: { gmailId } });
        if (!dbEmail) {
          dbEmail = await Email.create({
            gmailId,
            sender: senderEmail,
            email: recipientEmail,
            subject,
            body,
            date,
            translated: false,
            summarised: false,
            autoResponse: false,
          });
        }

        return res.json(dbEmail);

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
      // Gmail email
      const gmailId = id.replace(/^gmail-/, '');
      const gmail = google.gmail({ version: 'v1', auth });

      await gmail.users.messages.delete({
        userId: 'me',
        id: gmailId,
      });

      return res.json({ message: "Gmail message deleted successfully" });
    } else {
      // Database email
      const deleted = await Email.destroy({ where: { id } });

      if (!deleted) {
        return res.status(404).json({ error: "Email not found" });
      }

      return res.json({ message: "Database email deleted successfully" });
    }
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

router.post("/translate/:id", async (req, res) => {
  try {
    // 1️⃣ Try DB first
    let email = await Email.findByPk(req.params.id);

    // 2️⃣ If not in DB, fetch from Gmail API
    if (!email) {
      const gmail = google.gmail({ version: "v1", auth });

      // ✅ Strip "gmail-" prefix before passing to Gmail
      const gmailId = req.params.id.replace(/^gmail-/, "");

      const gmailMsg = await gmail.users.messages.get({
        userId: "me",
        id: gmailId,
      });

      // Decode Gmail body (base64)
      const bodyData = gmailMsg.data.payload.parts
        ? gmailMsg.data.payload.parts.map(part => part.body.data).join("")
        : gmailMsg.data.payload.body.data;

      const body = Buffer.from(bodyData, "base64").toString("utf-8");

      email = {
        gmailId,
        sender: gmailMsg.data.payload.headers.find(h => h.name === "From").value,
        email: gmailMsg.data.payload.headers.find(h => h.name === "To").value,
        subject: gmailMsg.data.payload.headers.find(h => h.name === "Subject").value,
        body,
      };
    }

    // 3️⃣ Call Claude for translation
    const translatedText = await callClaude(`Translate this email to English:\n\n${email.body}`);

    // 4️⃣ Save only in DB (not Gmail)
    const newEmail = await Email.create({
      gmailId: email.gmailId,
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
    let email = await Email.findByPk(req.params.id);

    if (!email) {
      const gmail = google.gmail({ version: "v1", auth });

      // ✅ Strip prefix
      const gmailId = req.params.id.replace(/^gmail-/, "");

      const gmailMsg = await gmail.users.messages.get({
        userId: "me",
        id: gmailId,
      });

      const bodyData = gmailMsg.data.payload.parts
        ? gmailMsg.data.payload.parts.map(part => part.body.data).join("")
        : gmailMsg.data.payload.body.data;

      const body = Buffer.from(bodyData, "base64").toString("utf-8");

      email = {
        gmailId,
        sender: gmailMsg.data.payload.headers.find(h => h.name === "From").value,
        email: gmailMsg.data.payload.headers.find(h => h.name === "To").value,
        subject: gmailMsg.data.payload.headers.find(h => h.name === "Subject").value,
        body,
      };
    }

    const summary = await callClaude(`Summarise this email:\n\n${email.body}`);

    const newEmail = await Email.create({
      gmailId: email.gmailId,
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
    let email = await Email.findByPk(req.params.id);

    // 1️⃣ If not in DB, fetch from Gmail
    if (!email) {
      const gmail = google.gmail({ version: "v1", auth });

      // ✅ Strip prefix
      const gmailId = req.params.id.replace(/^gmail-/, "");

      const gmailMsg = await gmail.users.messages.get({
        userId: "me",
        id: gmailId,
      });

      // Decode Gmail body (base64)
      const bodyData = gmailMsg.data.payload.parts
        ? gmailMsg.data.payload.parts.map(part => part.body.data).join("")
        : gmailMsg.data.payload.body.data;

      const body = Buffer.from(bodyData, "base64").toString("utf-8");

      email = {
        gmailId,
        sender: gmailMsg.data.payload.headers.find(h => h.name === "From").value,
        email: gmailMsg.data.payload.headers.find(h => h.name === "To").value,
        subject: gmailMsg.data.payload.headers.find(h => h.name === "Subject").value,
        body,
      };
    }

    // 2️⃣ Ask Claude to generate response
    const responseText = await callClaude(`Write a professional response to this email:\n\n${email.body}`);

    // 3️⃣ Save only in DB
    const newEmail = await Email.create({
      gmailId: email.gmailId,
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
