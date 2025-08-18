require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());


const UPLOADS_DIR = path.join(__dirname, 'uploads');
const AVATARS_DIR = path.join(UPLOADS_DIR, 'avatars');
fs.mkdirSync(AVATARS_DIR, { recursive: true });


app.use('/uploads', express.static(UPLOADS_DIR));

app.get('/', (req, res) => res.send('Welcome to VHA.'));

const tutorialRoute  = require('./routes/tutorial');
const userRoute      = require('./routes/user');
const reviewRoutes   = require('./routes/reviews');
const emailRoutes    = require('./routes/email');
const categoryRoutes = require('./routes/categories');
const aiRoutes       = require('./routes/ai');
const chatbotRoute   = require('./routes/Chatbot');
const gmailRouter    = require('./routes/gmailRouter');

app.use('/tutorial',        tutorialRoute);
app.use('/user',            userRoute);
app.use('/api/reviews',     reviewRoutes);
app.use('/api/email',       emailRoutes);
app.use('/categories',      categoryRoutes);
app.use('/api/ai',          aiRoutes);
app.use('/api/chatbot',     chatbotRoute);
app.use('/api/gmail',       gmailRouter);

const db = require('./models');


db.sequelize.sync({ force: false, alter: false })
  .then(() => {
    const port = process.env.APP_PORT || 8080; 
    app.listen(port, () => {
      console.log(` Server running at: http://localhost:${port}`);
    });
  })
  .catch((err) => console.error(' Failed to sync database:', err));
