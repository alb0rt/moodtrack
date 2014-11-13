var express = require('express');
var router = express.Router();
var twilio = require('twilio');
var config = require('../config');
var utils = require('../utils');


module.exports = function(app, passport) {

	/* GET home page. */
	app.get('/', function(req, res) {
	  res.render('index', { title: "Moodtrack" });
	});

	/* GET sign in page. */
	app.get('/login', function(req,res) {
		res.render('login', {
			title	: "Moodtrack",
			message	: req.flash('loginMessage') });
	});
	
	app.post('/login', passport.authenticate('local-login', {
		successRedirect : '/profile',
		failureRedirect : '/login',
		failureFlash 	: true
	}));

	app.get('/signup', function(req, res) {
		res.render('signup', {
			title	: "Moodtrack",
			message : req.flash('signupMessage')});
	});

	app.post('/signup', 
		passport.authenticate('local-signup', {
		successRedirect : '/profile',
		failureRedirect : '/signup',
		failureFlash 	: true
		})
	);

	/* POST login to account */
	/*router.post('/login', function(req, res) {

		var userName = req.body.username;
		var phoneNumber = req.body.phonenumber;

		var db = req.db;
		var collection = db.collection('moodtrack').aggregate([
			{
				$match : {
					username : userName
				} 
			}, {
				$project : {
					username : 1,
					timestamp : 1,
					rating : 1,
					timestampLocal : {$subtract : ["$timestamp", 25200000]}}
			}, {
				$project : { 
					username : 1,
					timestamp : 1,
					timestampLocal : 1,
					rating : 1,
					year : {$year : "$timestampLocal"}, 
					month : {$month: "$timestampLocal"},
					day : {$dayOfMonth: "$timestampLocal"},
					week: {$week: "$timestampLocal"},
					dayOfWeek: {$dayOfWeek : "$timestampLocal"}
				}
			}
		], function (err, result) {
			console.log(result);
			res.redirect("moodlist");
			res.render('moodlist', {title: "Mood List", moodList:result});
		});
	});

	/* DEBUG ONLY - GET List history of ratings */
	app.get('/profile', isLoggedIn, function(req, res) {
		var db = req.db;
		var userName = req.user.username;
		var collection = db.collection('moodtrack').aggregate([
			{
				$match : {
					username : userName
				} 
			}, {
				$project : {
					username : 1,
					timestamp : 1,
					rating : 1,
					timestampLocal : {$subtract : ["$timestamp", 25200000]}}
			}, {
				$project : { 
					username : 1,
					timestamp : 1,
					timestampLocal : 1,
					rating : 1,
					year : {$year : "$timestampLocal"}, 
					month : {$month: "$timestampLocal"},
					day : {$dayOfMonth: "$timestampLocal"},
					week: {$week: "$timestampLocal"},
					dayOfWeek: {$dayOfWeek : "$timestampLocal"}
				}
			}
		], function (err, result) {
			//console.log(result);
			res.render('moodlist', {title: "Mood List", moodList:result});
		});
	});



	/* DEBUG - GET add new rating page. */
	app.get('/newrating', function(req, res) {
		res.render('newrating', {title: 'Add Daily Rating'});
	});

	/* POST sms to add rating service */
	app.post('/sms', function(req, res) {

		if (twilio.validateExpressRequest(req, config.twilio.key, {url: config.twilio.smsWebhook}) || config.disableTwilioSigCheck) {

	        res.header('Content-Type', 'text/xml');

	        var body = req.param('Body').trim();
	        var from = req.param('From');	

	       	//set internal db variable
			var db = req.db;

			// Set our collections
			var collection = db.collection('moodtrack');
			var userCollection = db.collection('users');

			
			// Check to see if valid user
			userCollection.findOne({"phonenumber" : from}, function(err, result) {
				// Send error if user doens't exist
				if(result == null) {
					console.log("User not found");
					res.send("<Response><Sms>User not found</Sms></Response>");
				}
				
				else {

					// Submit to the DB
					collection.insert({
						"username" : result.username, 
						"phonenumber" : from,
						"timestamp" : new Date(),
						"rating" : body,
						"question": "How do you feel about work"
					}, function(err, doc) {
						if(err) {
							// If it failed, send error
							console.log("There was a problem adding to the database");
							res.send("<Response><Sms>Error adding to the database</Sms></Reponse>");
						} 
					});	

					// create response

					var today = new Date();
					var dateRange = new Date();
					dateRange.setDate(dateRange.getDate() - 7);

					collection.find({"phonenumber" : from, "timestamp" : {$gte: dateRange, $lt: today}}).toArray(function(err, result) {
						if(err) {
							console.log("Error searching for data to generate the response");
							res.send("<Response><Sms>👍</Sms></Reponse>")
						}

						// handle new users

						if(result.length == 0) {
							res.send('<Response><Sms>Thanks! Your first rating has been recorded 👍</Sms></Response>')
						} 

						// generate response for all other users
						else {
							var totalRating = 0;
							for(var i = 0; i < result.length; i++) {
								totalRating += parseInt(result[i].rating, 10);
							}

							var averageRating = totalRating/result.length;

							res.send('<Response><Sms>' + utils.generateResponse(body, Math.round(averageRating*10)/10) + '</Sms></Response>'); 
						}
					});	
				}
			});

	        

	    } else {
	    	console.log("error");
	    	res.statusCode = 403;
	    	res.render('forbidden');
	    }
	});

	/* POST to add rating service */
	app.post('/addrating', function(req, res) {


		//set internal db variable
		var db = req.db;

		// get form variables
		var userName = req.body.username;
		var phoneNumber = req.body.phonenumber;
		var rating = req.body.rating;

		// Set our collection
		var collection = db.collection('moodtrack');


		// Submit to the DB
		collection.insert({
			"username" : userName, 
			"phonenumber" : phoneNumber,
			"timestamp" : new Date(),
			"rating" : rating,
			"question": "How do you feel about work"
		}, function(err, doc) {
			if(err) {
				// If it failed, send error
				res.send("There was a problem adding to the database");
			} else {
				res.location("moodlist");
				res.redirect("moodlist");
			}
		});

	});

	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	
};

function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()) {
		return next();
	}

	res.redirect('/');
}


//module.exports = router;
