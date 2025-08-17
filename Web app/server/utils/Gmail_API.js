// GmailAPI.js
const { google } = require("googleapis");

// Create an OAuth2 client
const auth = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

// Set refresh token (so backend can fetch without manual login every time)
auth.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN,
});

const gmail = google.gmail({ version: "v1", auth });

/**
 * Fetch a list of recent emails for the linked account
 */
async function listEmails() {
  const res = await gmail.users.messages.list({
    userId: "me", // "me" means the authenticated account (vhaengineeringconsultants@gmail.com)
    maxResults: 10,
  });

  if (!res.data.messages) return [];

  const emails = await Promise.all(
    res.data.messages.map(async (msg) => {
      const full = await gmail.users.messages.get({
        userId: "me",
        id: msg.id,
      });

      const headers = full.data.payload.headers;
      const subject = headers.find((h) => h.name === "Subject")?.value;
      const from = headers.find((h) => h.name === "From")?.value;
      const date = headers.find((h) => h.name === "Date")?.value;

      let body = "";
      if (full.data.payload.parts) {
        const part = full.data.payload.parts.find(
          (p) => p.mimeType === "text/plain"
        );
        if (part?.body?.data) {
          body = Buffer.from(part.body.data, "base64").toString("utf-8");
        }
      }

      return { id: msg.id, subject, from, date, body };
    })
  );

  return emails;
}

module.exports = { listEmails };
