var express = require('express');
var router = express.Router();
var twilio = require('twilio');
var config = require('../config');
var utils = require('../utils');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: "Moodtrack" });
});

router.post('/', function(req, res) {

	var userName = req.body.username;
	var phoneNumber = req.body.phonenumber;

	var db = req.db;
	var collection = db.collection('moodtrack').find({'username' : userName, 'phonenumber' : phoneNumber}, null, {sort: {'_id':-1}}).toArray(function(err, result) {
		if (err) 
			throw err;
		console.log(result);
		if(result.length == 0) {
			res.render('index', {title: "Moodtrack" });
		} 
		else {
			res.render('moodlist', {title: "Mood List", moodList: result});
		}
		
	});
});

/* GET List history of ratings */
router.get('/moodlist', function(req, res) {
	var db = req.db;
	db.collection('moodtrack').find({}, null, {limit: 3, sort: {'_id':-1}}).toArray(function(err, result) {
	
		if (err)
			throw err;
		console.log(result);
		res.render('moodlist', {title: "Mood List", moodList:result});
		
	});

});

/* GET add new rating page. */
router.get('/newrating', function(req, res) {
	res.render('newrating', {title: 'Add Daily Rating'});
});

/* POST sms to add rating service */
router.post('/sms', function(req, res) {

	if (twilio.validateExpressRequest(req, config.twilio.key, {url: config.twilio.smsWebhook}) || config.disableTwilioSigCheck) {

        res.header('Content-Type', 'text/xml');

        var body = req.param('Body').trim();
        // the voter, use this to keep people from voting more than once
        var from = req.param('From');

       	//set internal db variable
		var db = req.db;

		// Set our collection
		var collection = db.collection('moodtrack');

		
		// Check to see if valid user
		collection.findOne({"phonenumber" : from}, function(err, result) {
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

					var totalRating = 0;
					for(var i = 0; i < result.length; i++) {
						totalRating += parseInt(result[i].rating, 10);
					}

					var averageRating = totalRating/result.length;

					res.send('<Response><Sms>' + utils.generateResponse(body, Math.round(averageRating*10)/10) + '</Sms></Response>'); 
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
router.post('/addrating', function(req, res) {


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




module.exports = router;


/*
// Check to see if user has already voted 
			var today = new Date();
			var yesterday = new Date();
			yesterday.setDate(yesterday.getDate() - 1);
			collection.find({"timestamp" : {$gte: yesterday, $lt: today}}).toArray(function(err, result) {
				if(result.length) {
					console.log("Already voted today");
					res.location("newrating");
					res.redirect("newrating");
				} else {
*/