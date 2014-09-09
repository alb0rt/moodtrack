var express = require('express');
var router = express.Router();
var twilio = require('twilio');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Mood Tracker' });
});

/* GET List history of ratings */
router.get('/moodlist', function(req, res) {
	var db = req.db;
	var collection = db.collection('moodtrack').find().toArray(function(err, result) {
		if (err)
			throw err;
		res.render('moodlist', {moodlist:result});
		console.log(result);
	});

});

/* GET add new rating page. */
router.get('/newrating', function(req, res) {
	res.render('newrating', {title: 'Add Daily Rating'});
});

router.post('/addrating/sms', function(req, res) {
	if (twilio.validateExpressRequest(request, config.twilio.key, {url: config.twilio.smsWebhook}) || config.disableTwilioSigCheck) {
        res.header('Content-Type', 'text/xml');
        var body = request.param('Body').trim();

        // the number the vote it being sent to (this should match an Event)
        var to = request.param('To');
        
        // the voter, use this to keep people from voting more than once
        var from = request.param('From');
        res.send('<Response><Sms>Vote recorded</Sms></Response>'); 

        res.render('index', {title:"hit"});
    } else {
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


	// Check to see if valid user
	collection.find({"username" : userName, "phonenumber" : phoneNumber}).toArray(function(err, result) {
		// Redirect to new rating page if user doens't exist
		if(!result.length) {
			console.log("Username not found");
			res.location("newrating");
			res.redirect("newrating");
		} else {
			// Submit to the DB
			collection.insert({
				"username" : userName, 
				"phoneNumber" : phoneNumber,
				"timestamp" : Date.now(),
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
		}
	});
});

module.exports = router;
