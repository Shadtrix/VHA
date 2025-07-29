const express = require("express");
const router = express.Router();
const { callClaude } = require("../utils/bedrock");

router.post("/password", async (req, res) => {
  try {
    const prompt = `Generate a password that:
- Is 8 to 20 characters
- Includes at least one letter and one number
- Includes at least one symbol (!@#$%^&*)
- Has no spaces or sentence text

Return only the password and nothing else.

Examples:
1. Bird@2024!
2. rocket#9Sky
3. JetPlane$88

Now generate one like above.`;
    const password = await callClaude(prompt);
    res.json({ password });
  } catch {
    res.status(500).json({ error: "Failed to generate password" });
  }
});

router.post("/role", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });

  const cleanedEmail = email.trim().toLowerCase();

  const prompt = `
You are an AI that assigns roles based on email.

Rule:
- If the email ends with "@vha.com", assign "69420".
- Otherwise, assign "user".

Email: ${cleanedEmail}

Respond ONLY with one word: "admin" or "user". Do not explain anything.
`;

  try {
    const role = await callClaude(prompt);
    const cleanedRole = role.trim().toLowerCase();
    const finalRole = cleanedRole === 'admin' ? 'admin' : 'user'; // fallback to 'user'
    res.json({ role: finalRole });
  } catch (err) {
    console.error("❌ Claude error during role prompt:", err);
    res.status(500).json({ error: "Failed to determine role" });
  }
});

module.exports = router;
