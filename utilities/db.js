var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
    autoIncrement = require('mongoose-auto-increment');    

var uri = 'mongodb://admin:adminTonight@ds137246.mlab.com:37246/whats_on_tonight';

mongoose.Promise = global.Promise

mongoose.connect(uri);

var db = mongoose.connection;

autoIncrement.initialize(db);

db.on('error', console.error.bind(console, 'connection error:'));


// Create User schema
var userSchema = mongoose.Schema({
salt: String,
password_digest: String,
username: String,
});

// Create list schema
var listSchema = mongoose.Schema({
	userId: String,
	showNames: [String]
})

listSchema.plugin(autoIncrement.plugin, 'List');
var List = mongoose.model('List', listSchema);

userSchema.plugin(autoIncrement.plugin, 'User');
var User = mongoose.model('User', userSchema);

module.exports.db = db;
module.exports.User = User;
module.exports.List = List;