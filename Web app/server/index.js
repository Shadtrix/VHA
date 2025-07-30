require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();


app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173"
}));


app.use(express.json());


app.get("/", (req, res) => {
  res.send("Welcome to VHA.");
});

const tutorialRoute = require('./routes/tutorial');
app.use("/tutorial", tutorialRoute);

const userRoute = require('./routes/user');
app.use("/user", userRoute);

const reviewRoutes = require("./routes/reviews");
app.use("/api/reviews", reviewRoutes);

const emailRoute = require('./routes/email');
app.use('/api/email', emailRoute);

const categoryRoutes = require('./routes/categories');
app.use('/categories', categoryRoutes);

const aiRoutes = require('./routes/ai');
app.use('/api/ai', aiRoutes);

const chatbotRoute = require("./routes/chatbot");
app.use("/api/chatbot", chatbotRoute);


const db = require('./models');
db.sequelize.sync({ force: false, alter: false })
  .then(() => {
    const port = process.env.APP_PORT || 8080;
    app.listen(port, () => {
      console.log(` Server running at: http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error(" Failed to sync database:", err);
  });
