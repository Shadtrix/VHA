const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { User } = require('../models');
const yup = require("yup");
const { sign } = require('jsonwebtoken');
require('dotenv').config();
const { validateToken } = require('../middlewares/auth');

// Register route
router.post("/register", async (req, res) => {
  let data = req.body;

  // Determine role based on roleKey
  let role = "user";
  if (data.roleKey === "69420") {
    role = "admin";
  }

  // Validation schema
  const validationSchema = yup.object({
    name: yup.string().trim().min(3).max(50).required().matches(/^[a-zA-Z '-,.]+$/, "Name only allows letters, spaces and characters: ' - , ."),
    email: yup.string().trim().lowercase().email().max(50).required(),
    password: yup.string().trim().min(8).max(50).required()
      .matches(/^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/, "Password must include at least 1 letter and 1 number")
  });

  try {
    data = await validationSchema.validate(data, { abortEarly: false });

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
  return res.status(400).json({ message: errorMsg });
}

    // Include role in userInfo
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
router.get("/all", async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'name', 'email', 'role', 'createdAt', 'password'] 
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
});



module.exports = router;
