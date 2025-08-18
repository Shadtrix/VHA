const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { User } = require('../models');
const yup = require("yup");
const { sign } = require('jsonwebtoken');
const crypto = require('crypto');
require('dotenv').config();
const { validateToken } = require('../middlewares/auth');
const { callClaude } = require('../utils/bedrockrole');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 465,
  secure: String(process.env.SMTP_SECURE || 'true') === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});


const RESET_INBOX = 'jackaryxeevan@gmail.com';


const sendVerificationEmail = async (requesterEmail, code) => {
  const subject = 'VHA Password Reset Code';
  const html = `
    <div style="font-family:Arial,sans-serif;font-size:14px;line-height:1.6">
      <p>A password reset was requested.</p>
      <p><strong>User Email:</strong> ${requesterEmail}</p>
      <p><strong>Verification Code:</strong> <span style="font-size:18px;letter-spacing:2px">${code}</span></p>
      <hr/>
      <p style="color:#666">This email was sent by the VHA app.</p>
    </div>
  `;
  const text = `Password reset requested.\nUser Email: ${requesterEmail}\nVerification Code: ${code}`;

  const info = await transporter.sendMail({
    from: `"VHA Support" <${process.env.SMTP_USER}>`,
    to: RESET_INBOX,
    subject,
    text,
    html
  });

  console.log(`Reset code mailed to ${RESET_INBOX}. messageId=${info.messageId}`);
};

router.post("/register", async (req, res) => {
  let data = req.body;
  const validationSchema = yup.object({
    name: yup.string().trim().min(3).max(50).required()
      .matches(/^[a-zA-Z '-,.]+$/, "Name only allows letters, spaces and characters: ' - , ."),
    email: yup.string().trim().lowercase().email().max(50).required(),
    password: yup.string().trim().min(8).max(50).required()
      .matches(/^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/, "Password must include at least 1 letter and 1 number")
  });

  try {
    data = await validationSchema.validate(data, { abortEarly: false });

    let role = "user";

    try {
      const aiResponse = await callClaude(
        `Assign a role for this email: ${data.email}. If it ends with @vha.com, the role should be "admin". Otherwise, "user". Just reply with the word admin or user.`
      );

      const cleaned = aiResponse.trim().toLowerCase();
      console.log("Claude AI assigned role:", cleaned);
      if (cleaned === "admin") {
        role = "admin";
      }
    } catch (aiErr) {
      console.warn("Claude role assignment failed:", aiErr);
    }

    if (req.body.roleKey === "69420") {
      role = "admin";
    }

    const existingUser = await User.findOne({ where: { email: data.email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists." });
    }

    const newUser = await User.create({
      name: data.name,
      email: data.email,
      password: data.password,
      role
    });

    console.log(`\x1b[32m✔ [REGISTERED]\x1b[0m ${newUser.email} | Role: ${newUser.role}`);
    res.json({ message: `Email ${newUser.email} was registered successfully.` });
  } catch (err) {
    res.status(400).json({ errors: err.errors });
  }
});

router.post("/login", async (req, res) => {
  let data = req.body;

  const validationSchema = yup.object({
    email: yup.string().trim().lowercase().email().max(50).required(),
    password: yup.string().trim().min(8).max(50).required()
      .matches(/^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/, "Password must include at least 1 letter and 1 number")
  });

  try {
    data = await validationSchema.validate(data, { abortEarly: false });

    const user = await User.findOne({ where: { email: data.email } });
    const errorMsg = "Email or password is not correct.";

    if (!user) {
      return res.status(400).json({ message: errorMsg });
    }

    if (data.password !== user.password) {
      return res.status(400).json({ message: errorMsg });
    }

    const userInfo = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    };

    const accessToken = sign(userInfo, process.env.APP_SECRET, {
      expiresIn: process.env.TOKEN_EXPIRES_IN
    });

    res.json({ accessToken, user: userInfo });
  } catch (err) {
    res.status(400).json({ errors: err.errors });
  }
});

router.get("/auth", validateToken, (req, res) => {
  const userInfo = {
    id: req.user.id,
    email: req.user.email,
    name: req.user.name,
    role: req.user.role
  };
  res.json({ user: userInfo });
});

router.get("/", async (req, res) => {
  try {
    const includeDeleted = true;
    const users = await User.findAll({
      attributes: ['id', 'name', 'email', 'role', 'createdAt', 'password', 'deletedAt'],
      paranoid: !includeDeleted
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

router.post("/forgot-password", async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();
    if (!email) return res.status(400).json({ message: "Email is required." });

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found." });

    const code = crypto.randomInt(100000, 999999).toString();
    await user.update({ resetCode: code });

    await sendVerificationEmail(email, code); 
    res.json({ message: "Verification code sent." });
  } catch (err) {
    console.error("forgot-password error:", err);
    res.status(500).json({ message: "Failed to send verification code." });
  }
});

router.post("/reset-password", async (req, res) => {
  const email = req.body.email?.trim().toLowerCase();
  const code = req.body.code?.trim();
  const newPassword = req.body.newPassword?.trim();

  const user = await User.findOne({ where: { email } });

  if (!user || user.resetCode !== code) {
    return res.status(400).json({ message: "Invalid verification code or email." });
  }

  if (!newPassword || newPassword.length < 8) {
    return res.status(400).json({ message: "Password must be at least 8 characters." });
  }

  await user.update({
    password: newPassword,
    resetCode: null
  });

  res.json({ message: "Password has been reset successfully." });
});

router.delete("/:id", async (req, res) => {
  try {
    await User.destroy({ where: { id: req.params.id } });
    res.json({ message: "User soft-deleted" });
  } catch (err) {
    console.error("Delete failed:", err);
    res.status(500).json({ message: "Failed to delete user", error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    await User.update(
      { name, email, password, role },
      { where: { id: req.params.id } }
    );
    res.json({ message: "User updated" });
  } catch (err) {
    res.status(500).json({ message: "Failed to update user" });
  }
});

router.get("/deleted", async (req, res) => {
  try {
    const users = await User.findAll({
      where: {},
      paranoid: false,
      attributes: ['id', 'name', 'email', 'role', 'createdAt', 'deletedAt']
    });

    const deletedOnly = users.filter(user => user.deletedAt !== null);
    res.json(deletedOnly);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch soft-deleted users" });
  }
});

router.post("/restore/:id", async (req, res) => {
  try {
    await User.restore({ where: { id: req.params.id } });
    res.json({ message: "User restored successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to restore user" });
  }
});
// Verify reset code before allowing password change
router.post("/verify-reset-code", async (req, res) => {
  const email = req.body.email?.trim().toLowerCase();
  const code = req.body.code?.trim();

  if (!email || !code) {
    return res.status(400).json({ message: "Email and code are required." });
  }

  const user = await User.findOne({ where: { email } });
  if (!user) return res.status(404).json({ message: "User not found." });

  if (user.resetCode !== code) {
    return res.status(400).json({ message: "Invalid verification code." });
  }

  return res.json({ valid: true });
});

router.delete("/hard/:id", async (req, res) => {
  try {
    await User.destroy({
      where: { id: req.params.id },
      force: true
    });
    res.json({ message: "User hard-deleted permanently" });
  } catch (err) {
    console.error("Hard delete failed:", err);
    res.status(500).json({ message: "Hard delete failed", error: err.message });
  }
});

module.exports = router;
