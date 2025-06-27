const express = require("express");
const router = express.Router();
const { Email } = require("../models");

const emailData = [
  {
    id: 1,
    sender: "NYP Bursary",
    email: "bursary@nyp.edu.sg",
    subject: "Final Reminder AY2025 Gov Bursary App",
    body: "Dear student, ...",
    date: "April 15",
  },
  {
    id: 2,
    sender: "NYP Admissions",
    email: "admissions@nyp.edu.sg",
    subject: "Admissions Portal Update",
    body: "Dear applicant, ...",
    date: "April 14",
  },
];

router.get('/', (req, res) => {
  res.json(emailData);
});

module.exports = router;
