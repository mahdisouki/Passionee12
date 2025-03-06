const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const passport = require('./shared/passport-config')
const session = require('express-session');
const authRoutes = require('./routes/auth/authRoutes');
const bodyParser = require('body-parser');


const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
require("./shared/db");
app.use('/auth', authRoutes);



app.listen(5000, () => console.log('Server running on port 5000'));