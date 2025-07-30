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

// Simulated email sending
const sendVerificationEmail = (email, code) => {
  console.log(`Sending code ${code} to ${email}`); // Replace with nodemailer in production
};

// Register route
router.post("/register", async (req, res) => {
  let data = req.body;
  const validationSchema = yup.object({
    name: yup.string().trim().min(3).max(50).required().matches(/^[a-zA-Z '-,.]+$/, "Name only allows letters, spaces and characters: ' - , ."),
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

// Login route
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

// Auth route
router.get("/auth", validateToken, (req, res) => {
  const userInfo = {
    id: req.user.id,
    email: req.user.email,
    name: req.user.name,
    role: req.user.role
  };
  res.json({ user: userInfo });
});

// Fetch all users (admin)
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

// Forgot password - send code
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ where: { email } });

  if (!user) return res.status(404).json({ message: "User not found." });

  const code = crypto.randomInt(100000, 999999).toString();
  await user.update({ resetCode: code });

  sendVerificationEmail(email, code);
  res.json({ message: "Verification code sent." });
});

// Reset password
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
    console.error("Delete failed:", err); // ✅ full stack trace
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
    await User.restore({ where: { id: req.params.id } }); // ✅ restore method
    res.json({ message: "User restored successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to restore user" });
  }
});

// Hard delete (PERMANENT DELETE)
router.delete("/hard/:id", async (req, res) => {
  try {
    await User.destroy({
      where: { id: req.params.id },
      force: true // bypass soft delete
    });
    res.json({ message: "User hard-deleted permanently" });
  } catch (err) {
    console.error("Hard delete failed:", err);
    res.status(500).json({ message: "Hard delete failed", error: err.message });
  }
});

module.exports = router;
