const db = require('../utilities/db.js').db;
const User = require('../utilities/db.js').User;
const List = require('../utilities/db.js').List;
const bcrypt = require('bcrypt');

// Create a user
exports.create = function(username, password, callback) {
  // Create a salt and hash the password
  var salt = bcrypt.genSaltSync(10)
  var hashedPassword = bcrypt.hashSync(password, salt)

  // Create user
  var user = new User({
    salt: salt,
    password_digest: hashedPassword,
    username: username
  })

  user.save(function(err) {
    if(err) {
      callback(err);
      return;
    }
    // Create a Watch List for every new User
    var list = new List({
      userId: user._id,
      showNames: []
    })
    list.save(function(e) {
      callback(e);
    })
  })

}

exports.findByUsername = function(username, callback) {
  // search for the user with a given username
    User.findOne({'username' : username}, function(err, user) {
      callback(err,user)
  })
}

/* 
 * Find a user given their id
 * @param {number} id - id to be searched for in the database
 * @param {function} callback - the function to call upon completion
 */
exports.findById = function(id, callback) {
  // search for the user with a given username
  console.log(id)
    User.findOne({'_id' : id}, function(err, user) {
      callback(err,user)
  })
}
