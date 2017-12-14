const API = require('../api'),
  request = require('request'),
  moment = require('moment'),
  List = require('../utilities/db.js').List;

// Add a show to a users Watch List
exports.addToList = function(user, show, callback) {
	List.findOne({'userId' : user._id.toString()}, function(err, list) {
	 	if(err) { return }
		var options = {
			url: API.SEARCH+show,
			json: true
		};	

		request(options, function (error, response, body) {
		  if (!error && response.statusCode == 200) {
		  	console.log(body);
		  	list.showNames.push(body.name);
		  	list.save((err,list) => {
		  		callback(body);
		  	})
		  }
		})
  	})
}

// Get full day schedule
exports.fetch = function(callback) {
	var options = {
    	url: API.TODAY,
    	json: true
    };

	request(options, function (error, response, body) {
	  if (!error && response.statusCode == 200) {
	  	var shows = []
	  	for (var i = body.length - 1; i >= 0; i--) {
	  		// Get real end time
	  		var time = moment(body[i].airstamp).add(body[i].runtime, 'minutes')
	  		body[i].airdate = time;
  			shows.push(body[i])
	  	};
	  	callback(shows);
	  }
	})
}

// Get scheduele for a specific network
exports.fetchNetworkShows = function(network, callback) {
	var options = {
    	url: API.TODAY,
    	json: true
    };

	request(options, function (error, response, body) {
	  if (!error && response.statusCode == 200) {
	  	var shows = []
	  	for (var i = body.length - 1; i >= 0; i--) {
	  		// Check for "Other" option
	  		if(network == "Others" && (!body[i].show.network || ["NBC", "CBS", "ABC", "FOX"].indexOf(body[i].show.network.name) == -1)) {
	  			var time = moment(body[i].airstamp).add(body[i].runtime, 'minutes')
	  			body[i].airdate = time;
  				shows.push(body[i])
	  		}
	  		// Check for network options
	  		if(body[i].show.network && body[i].show.network.name == network) {
	  			var time = moment(body[i].airstamp).add(body[i].runtime, 'minutes')
	  			body[i].airdate = time;
  				shows.push(body[i])
  			}
	  	};
	  	callback(shows);
	  }
	})
}

// Remove a Show from a user's Watch List
exports.removeFromUserList = function(user, show, callback) {
	List.findOne({'userId' : user._id.toString()}, function(err, list) {
		if(err) { return }
		var index = list.showNames.indexOf(show);
		if (index > -1) {
    		list.showNames.splice(index, 1);
    		list.save((err, list) => {
    			callback(err,list)
    		})
		}
	})
}

// Fetch just names of shows on Watch List
exports.fetchUserListNames = function(user, callback) {
	List.findOne({'userId' : user._id.toString()}, function(err, list) {
		callback(list.showNames)
	})
}

// Get full infor for user's Watch List
exports.fetchUserList = function(user, callback) {
	List.findOne({'userId' : user._id.toString()}, function(err, list) {
	 	if(err) { return }
		var options = {
			url: API.TODAY,
			json: true
		};	

		request(options, function (error, response, body) {
		  if (!error && response.statusCode == 200) {
		  	var shows = []
		  	for (var i = body.length - 1; i >= 0; i--) {

		  		if( list.showNames.indexOf(body[i].show.name) != -1) {
		  			var time = moment(body[i].airstamp).add(body[i].runtime, 'minutes')
		  			body[i].airdate = time;
	  				shows.push(body[i])
		  		}
		  	};
		  	callback(shows);
		  }
		})
  	})
}

