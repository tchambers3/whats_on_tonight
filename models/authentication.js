var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var expressSession = require('express-session');
const users = require('./users');
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
const bcrypt = require('bcrypt');



exports.init = function (app) {
  console.log("erasdfasdf")
  // If you are using sessions, or Passport sessions, include the middleware
  // For more info: https://github.com/expressjs/session
  app.use(expressSession((
    {secret: 'whatson', // Sessions will be "signed" to prevent tampering
     resave: false,     // Don't resave session if not saved
     saveUninitialized: true }))); // Save uninitialized session
  // Initialize Passport
  app.use(passport.initialize());
  // Include middleware for Passport sessions.
  app.use(passport.session());
  // Return the Passport object configured here.
  return passport;
}

passport.use(new Strategy(
  function(username, password, done) {
    users.findByUsername(username, function(err, foundUser) {
      if (err) { return done(err); }
      if (!foundUser) { return done(null, false); }
      // Get salt from user and use bcrypt to hash password
      var salt = foundUser.salt;
      var hashedPassword = bcrypt.hashSync(password, salt)
      // Compare hashed passwords
      if (foundUser.password_digest != hashedPassword) { return done(null, false); }
      return done(null, foundUser);
    });
  }));


/*
 * Define Passport authenticated session persistence.
 * Passport sessions will restore authentication state and user information
 * across HTTP requests.  It does this by using HTTP header cookies.
 * To support this, Passport needs to serialize the user information into
 * the cookie. And on the next request, deserialize the user from the cookie.
 * The easiest way to do this is to simply supply the user ID when serializing
 * and querying the user record by ID from the database when deserializing.
 * Upon deserialization, Passport will put the user in req.user.
 */

/* 
 * Serialize the users
 * @param {function} anonymous - the serializing function for Passport to users
 * and for the anonymous function
 * @param {object} user - the user object for the currently logged-in users
 * @param {function} done - callback function to pass the object to include
 *  in the cookie.  This object must be sufficient to look up the user object
 *  on the next request.
 */
passport.serializeUser(function(user, done) {
  // Pass null for no error, and the user ID as a key to lookup the user
  // upon deserialization.
  done(null, user._id);
});

/* 
 * Deserialize the users
 * @param {function} anonymous - the serializing function for Passport to users
 * and for the anonymous function
 * @param {number} id - the id of the user associated with this request
 * @param {function} done - callback function to pass the user object to
 *   Passport.  Passport will put the foundUser object onto req as req.user.
 */
passport.deserializeUser(function(id, done) {
  users.findById(id, function (err, foundUser) {
    // pass back err (if any) and the user object associated with this ID
    done(err, foundUser);
  });
});


