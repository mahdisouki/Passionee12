const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const passport = require('./shared/passport-config')
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors')
const setupSwagger = require("./swaggerConfig"); // Import Swagger setup
const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
const corsOptions = {
    origin: ['*' , 'http://localhost:51035'], 
    optionsSuccessStatus: 200 
  };
app.use(cors(corsOptions))
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
require("./shared/db");

const authRoutes = require('./routes/auth/authRoutes');
const teamRoutes = require('./routes/match/teamRoute');
const playerRoutes = require('./routes/match/playerRoute');
const fixtureRoutes = require('./routes/match/fixtureRoute');
const pickteamRoutes = require('./routes/match/pickteamRoute');
const quizRoutes = require('./routes/quiz/quizRoute');
const quizUserAnswerRoutes = require('./routes/quiz/quizUserAnswerRoute');
const blogRoutes = require('./routes/blog/blogRoutes')

  
app.use('/auth', authRoutes);
app.use('/team', teamRoutes);
app.use('/player', playerRoutes);
app.use('/fixture' ,fixtureRoutes);
app.use('/pickteam' , pickteamRoutes);
app.use('/quiz', quizRoutes);
app.use('/user-answer',quizUserAnswerRoutes)
app.use('/blogs',blogRoutes)

setupSwagger(app); // Initialize Swagger documentation

app.listen(5000, () => console.log('Server running on port 5000'));