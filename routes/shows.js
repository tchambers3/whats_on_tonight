const User = require('../models/users.js'),
      Show = require('../models/shows.js'),
      moment = require('moment');

exports.init = function(app) {
  app.get('/shows', getShows); 
  app.get('/shows/:network', getShowsOnNetwork); 
}

// Get all shows
var getShows = function(req,res) {
	 Show.fetch((shows) => {
	 	res.send(shows);
	 });
}

// Get shows on a network
var getShowsOnNetwork = function(req,res) {
	 Show.fetchNetworkShows(req.params.network, (shows) => {
	 	res.send(shows);
	 });
}