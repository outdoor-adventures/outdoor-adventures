require('dotenv').config();
const express = require('express');
const { S3Client} = require('@aws-sdk/client-s3');

// Instantiate an express server:
const app = express();

// Use process.env.PORT if it exists, otherwise use 5001:
const PORT = process.env.PORT || 5001;

// Require auth-related middleware:
const sessionMiddleware = require('./modules/session-middleware');
const passport = require('./strategies/user.strategy');

// Require router files:
const userRouter = require('./routes/user.router');

//require adventure router file
const adventureRouter = require('./routes/adventure.router');

//require cost, difficulty, category router
const dropdownRouter = require('./routes/dropdowns.router');

//require newsletter router file
const newsletterRouter = require('./routes/newsletter.router');

// Apply middleware:
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('build'));
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());


app.use(express.static('public'));
app.use('/uploads', express.static('public/uploads'));

// Apply router files:
app.use('/api/user', userRouter);

// apply adventure router
app.use('/api/adventures', adventureRouter);

//apply price, difficulty, category router
app.use('/api/dropdown', dropdownRouter);
app.use('/api/recent/recent', dropdownRouter);

//apply newsletter router
app.use('/api/newsletter', newsletterRouter);

// Start the server:
app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
