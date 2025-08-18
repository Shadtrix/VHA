require('dotenv').config();
const { google } = require("googleapis");


const auth = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

auth.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN
});

async function initAuth() {
  try {
    const { token } = await auth.getAccessToken();
    console.log("✅ Access token obtained:", token ? "OK" : "Failed");
  } catch (err) {
    console.error("❌ Failed to refresh access token:", err);
  }
}

initAuth();

const gmail = google.gmail({ version: "v1", auth });

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
async function deleteEmail(emailId) {
  try {
    await gmail.users.messages.delete({ userId: "me", id: emailId });
    console.log("Email deleted successfully");
  } catch (err) {
    console.error(err.response?.data || err.message);
  }
}

async function sendEmail(rawMessage) {
  await gmail.users.messages.send({
    userId: "me",
    requestBody: { raw: rawMessage },
  });
}

module.exports = { listEmails, deleteEmail, sendEmail };
