const expressSession = require('express-session');
const PgSession = require('connect-pg-simple')(expressSession);
const pool = require('./pool.js');
const warnings = require('../constants/warnings');

/*
  The session makes it so a user can enters their username and password one time,
  and then we can keep them logged in. We do this by giving them a really long random string
  that the browser will pass back to us with every HTTP request. (AKA: The cookie!) This long
  random string is something the server can validate and use to "know" which user is logged in.

  You can actually see this string that gets passed back and forth in Chrome DevTools:
    `application` ->  `storage` -> `cookies`
*/

const serverSessionSecret = () => {
  if (
    !process.env.SERVER_SESSION_SECRET ||
    process.env.SERVER_SESSION_SECRET.length < 8 ||
    process.env.SERVER_SESSION_SECRET === warnings.exampleBadSecret
  ) {
    // Warning if user doesn't have a good secret:
    console.log(warnings.badSecret);
  }

  return process.env.SERVER_SESSION_SECRET;
};

let pruneSessionInterval = 60;

if (process.env.NODE_ENV === 'test') {
  pruneSessionInterval = false;
}


module.exports = expressSession({
  store: new PgSession({
    pool,
    createTableIfMissing: true,
    pruneSessionInterval,
  }),
  secret: serverSessionSecret() || 'secret', // please set this in your .env file
  name: 'user', // this is the name of the req.variable. 'user' is convention, but not required
  saveUninitialized: false,
  resave: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7, // cookie expires after 7 days 
    httpOnly: true, // prevents client-side JS from accessing cookie 
    secure: false // can only be set to true if the app utilizes https
  },
});
