require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Enable CORS
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173", // fallback
}));

// Middleware to parse JSON
app.use(express.json());

// Simple welcome route
app.get("/", (req, res) => {
    res.send("Welcome to VHA.");
});

// Routes
const tutorialRoute = require('./routes/tutorial');
app.use("/tutorial", tutorialRoute);

const userRoute = require('./routes/user');
app.use("/user", userRoute);

// ✅ Review routes
const reviewRoutes = require("./routes/reviews");
app.use("/api/reviews", reviewRoutes); // Must come AFTER express.json()

// DB connection
const db = require('./models');
db.sequelize.sync({ alter: true }) // or use { force: false } in production
    .then(() => {
        const port = process.env.APP_PORT || 8080;
        app.listen(port, () => {
            console.log(`Server running on http://localhost:${port}`);
        });
    })
    .catch((err) => {
        console.error("Failed to sync database:", err);
    });
