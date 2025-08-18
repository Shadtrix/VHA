// server/routes/Chatbot.js
const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const router = express.Router();
const { callClaudeChatbot } = require("../utils/chatbotClaude");

function normalize(s = "") {
  return s.toLowerCase().replace(/\s+/g, " ").trim();
}

function isMEPOfferQuestion(input = "") {
  const q = normalize(input);

  const hasMEPKeyword =
    q.includes("mep") ||
    q.includes("mechanical") ||
    q.includes("electrical") ||
    q.includes("plumbing") ||
    q.includes("hvac");

  const serviceWords = [
    "offer",
    "offers",
    "offering",
    "offerings",
    "service",
    "services",
    "provide",
    "provides",
    "providing",
    "capability",
    "capabilities",
    "scope",
    "solution",
    "solutions",
    "what do you do",
    "what u do",
    "what can you do",
    "what do you offer",
    "what do u offer"
  ];

  const wordHit = hasMEPKeyword && serviceWords.some((w) => q.includes(w));

  const patternHit =
    /what\s+(do\s+you|u)\s+(offer|do|provide).*?(mep|mechanical|electrical|plumbing|hvac)/.test(
      q
    ) ||
    /(mep|mechanical|electrical|plumbing|hvac).*?(services?|offer|provide|solutions|capabilities|scope)/.test(
      q
    );

  return wordHit || patternHit;
}

async function fetchMEPText() {
  const url = "https://www.vha.sg/mep-engineering";
  const { data } = await axios.get(url, {
    timeout: 15000,
    headers: { "user-agent": "Mozilla/5.0 (compatible; VHA-RAG/1.0)" }
  });
  const $ = cheerio.load(data);
  $("script,style,noscript,svg,iframe,form,header,footer,nav").remove();
  const raw = $("main").text() || $("body").text() || "";
  const text = raw
    .replace(/\u00a0/g, " ")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  return { text, url };
}

function chunk(text, size = 1500) {
  const out = [];
  for (let i = 0; i < text.length; i += size) out.push(text.slice(i, i + size));
  return out;
}
function score(query, snippet) {
  const qwords = normalize(query).split(" ").filter(Boolean);
  const hay = normalize(snippet);
  let s = 0;
  for (const w of qwords) if (hay.includes(w)) s++;
  const boosters = ["service", "services", "offer", "provide", "scope", "capabilities", "solution", "solutions", "design", "installation", "maintenance"];
  for (const b of boosters) if (hay.includes(b)) s += 2;
  return s;
}
function pickRelevantSnippets(text, query, k = 3) {
  const chunks = chunk(text, 1500);
  const ranked = chunks
    .map((snip) => ({ snip, sc: score(query, snip) }))
    .filter((o) => o.sc > 0)
    .sort((a, b) => b.sc - a.sc);
  const chosen = (ranked.length ? ranked : chunks.slice(0, 2))
    .slice(0, k)
    .map((o) => o.snip);
  return chosen.join("\n---\n");
}

router.post("/", async (req, res) => {
  const { message } = req.body || {};
  if (!message) return res.status(400).json({ error: "Message is required" });

  try {
    
    if (isMEPOfferQuestion(message)) {
      try {
        const { text, url } = await fetchMEPText();
        const context = pickRelevantSnippets(text, message, 3);
        const reply = await callClaudeChatbot(
          message,
          context,
          "MEP Engineering",
          url
        );
        return res.json({ reply, source: { url, page: "mep" } });
      } catch (e) {
        console.warn("MEP fetch/parse failed; falling back. Reason:", e?.message);
      }
    }

    
    const reply = await callClaudeChatbot(message);
    return res.json({ reply });
  } catch (err) {
    console.error(" Chatbot error:", err);
    res.status(500).json({ error: "Failed to get AI response" });
  }
});

module.exports = router;
