const User = require('../models/users.js'),
      Show = require('../models/shows.js'),
      moment = require('moment');

exports.init = function(app) {
  var passport = app.get('passport');
  app.put('/register/:username/:password', registerUser); 
  app.post("/login", passport.authenticate('local', {
                                  failureRedirect: '/register.html',
                                  successRedirect: '/home'}));
  app.get("/home", checkAuthentication, userPortal);
  app.post("/list", checkAuthentication, listPortal);
  app.get('/shows/Mine', checkAuthentication, listShows);
  app.delete('/list/:show', checkAuthentication, deleteShow);
  app.put('/addToList/:show', checkAuthentication, addToList);
  app.post('/logout', doLogout);
}

// Create a new user
function registerUser(req,res) {
  User.create(req.params.username, req.params.password,(err)=> {
    if(err) {
      res.send(404);
    } else {
      res.render('homeAuthed', {user: req.user, moment: moment});
    }
  })
}

// Auth check
function checkAuthentication(req, res, next){
    // Passport will set req.isAuthenticate
    if(req.isAuthenticated()){
        next();
    }else{
        // The user is not logged in. Redirect to the login page.
        res.redirect("/login.html");
    }
}


// Add a show to a users Watch List
addToList = function(req, res) {
  if(req.user) {
    Show.addToList(req.user, req.params.show, (show) => {
      res.send(show);
    })
  } else {
    res.render('error', { 'message': 'Application error...' });
  }
}


// Remove a show from Watch LIst
deleteShow = function(req, res) {
  if(req.user) {
    Show.removeFromUserList(req.user, req.params.show, (err,list) => {
      if(!err) {
        Show.fetchUserList(req.user, (shows) => {
          res.render("list", {user: req.user, shows: shows})
        })
      }
    })
  } else {
    res.render('error', { 'message': 'Application error...' });
  }
}

// Get list of show names on Watch List
listShows = function(req, res) {
  if(req.user) {
     Show.fetchUserList(req.user, (shows) => {
      res.send(shows);
    })
  } else {
    res.render('error', { 'message': 'Application error...' });
  }
}

// Get a user's Watch List
listPortal = function(req, res) {
  if(req.user) {
    Show.fetchUserListNames(req.user, (shows) => {
      res.render("list", {user: req.user, shows: shows})
      // res.render('home', shows)
    })
  } else {
    res.render('error', { 'message': 'Application error...' });
  }
}

// User's Home page
userPortal = function(req, res) {
  // We only should get here if the user has logged in (authenticated) and
  // in this case req.user should be defined, but be careful anyway.
  if (req.user) {
    // Render the membership information view
    
    res.render('homeAuthed', {user: req.user, moment: moment});
  } else {
    // Render an error if, for some reason, req.user.displayName was undefined 
    res.render('error', { 'message': 'Application error...' });
  }
};

/* 
 * Log out the user
 */
function doLogout(req, res){
  // Passport puts a logout method on req to use.
  req.logout();
  // Redirect the user to the welcome page which does not require
  // being authenticated.
  res.redirect('/');
};