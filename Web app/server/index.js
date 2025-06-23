require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
// Enable CORS
app.use(cors({
    origin: process.env.CLIENT_URL
}));
app.use(express.json());
// Simple Route
app.get("/", (req, res) => {
    res.send("Welcome to VHA.");
});
// Routes
const tutorialRoute = require('./routes/tutorial');
app.use("/tutorial", tutorialRoute);
const db = require('./models');
db.sequelize.sync({ alter: true })
    .then(() => {
        let port = process.env.APP_PORT;
        app.listen(port, () => {
            console.log(`Sever running on http://localhost:${port}`);
        });
    })
    .catch((err) => {
        console.log(err);
    });