require('dotenv').config();
const express = require('express');
const app = express();
app.use(express.json());
const cors = require('cors');
// Simple Route
app.get("/", (req, res) => {
    res.send("Welcome to VHA.");
});
// Routes
const tutorialRoute = require('./routes/tutorial');
app.use("/tutorial", tutorialRoute);
let port = process.env.APP_PORT;
app.listen(port, () => {
    console.log(`Sever running on http://localhost:${port}`);
});
// Enable CORS
app.use(cors({
origin: process.env.CLIENT_URL
}));