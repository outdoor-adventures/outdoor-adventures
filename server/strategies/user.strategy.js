const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const encryptLib = require('../modules/encryption');
const pool = require('../modules/pool');

// When a user successfully logs in, this passport method persists
// that user's id into a session.
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserializing the user essentially means "looking up who you are"
// based on the user ID that's stored in the active session that
// corresponds to the cookie that came along with the request.
// This Passport method does the work of:
//   * Getting that user's info out of the "user" table.
//   * Attaching the user's info to the request as `req.user`.
// There are great answers to this Stack Overflow question, if you'd like
// more details about serializeUser and deserializeUser:
//   * https://stackoverflow.com/questions/27637609/understanding-passport-serialize-deserialize
passport.deserializeUser((id, done) => {
  const sqlText = `
    SELECT * FROM "user"
      WHERE "id" = $1;
  `;
  const sqlValues = [id];

  pool.query(sqlText, sqlValues)
    .then((dbRes) => {
      const user = dbRes && dbRes.rows && dbRes.rows[0];
      if (user) {
        // Remove the password property from the user object:
        delete user.password;
        // Attach the user object to the request as `req.user`:
        done(null, user);
      } else {
        // If no user was found, call `done` with no user object:
        done(null, null);
      }
    })
    .catch((dbErr) => {
      console.log('Error with query in passport.deserializeUser:', dbErr);
      // done takes an error (we have one) and a user (null in this case)
      // this will result in the server returning a 500 status code
      done(dbErr, null);
    });
});

// Middleware function that does the actual work of validating a login request
// and establishing a session. This function gets called whenever a request
// is made to POST /api/user/login.
passport.use(
  'local',
  new LocalStrategy((username, password, done) => {
    const sqlText = `
      SELECT * FROM "user"
        WHERE username = $1;
    `;
    const sqlValues = [username];

    pool.query(sqlText, sqlValues)
      .then((dbRes) => {
        const user = dbRes && dbRes.rows && dbRes.rows[0];
        
        if (user && encryptLib.comparePassword(password, user.password)) {
          // The request body's password has been hashed and matches the stored
          // hashed password. AKA: Login was successful! Now, we use Passport's
          // done function to instantiate a new session for this user.
            // The `done` function takes two arguments:
              // * An error. This is `null` in this case.
              // * A user we want to instatiate a session for.
          done(null, user);
        } else {
          // The request body's password has been hashed and DOES NOT match the
          // stored hashed password. AKA: Login was unsuccessful.
          // Calling `done` without an error or user will result in Passport
          // sending back HTTP 401.
          console.log('POST /api/user/login received an invalid login request.');
          done(null, null);
        }
      })
      .catch((dbErr) => {
        console.log('POST /api/user/login error:', dbErr);
        // In this case, something went wrong with the database query. So,
        // now we have an error object that we can feed into the `done` function.
        // This will result in Passport sending back HTTP 500.
        done(dbErr, null);
      });
  })
);


module.exports = passport;
