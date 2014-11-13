var twilio = require('twilio');
var config = require('./config');
var utils = require('./utils');
var client = new twilio.RestClient(config.twilio.sid, config.twilio.key);

var mongo = require('mongoskin');
var db = "";


//db = mongo.db("mongodb://localhost:27017/moodtrack", {native_parser:true});
db = mongo.db("mongodb://skronch:qwe123@ds035270.mongolab.com:35270/heroku_app29348857", {native_parse:true});	

//var collection = db.collection("moodtrack");
var collection = db.collection("users");


function sendReminder() {
	if(!utils.isVacation())
	{
		var users = collection.aggregate([
		{
			$project : {
				username : 1,
				phonenumber : 1
			}
		}], function(err, result) {
			for (var i = 0; i < result.length; i++) {
				console.log(result[i].phonenumber);
				client.sms.messages.create({
					to : result[i].phonenumber,
					from : config.twilio.number,
					body : "How was work today? (1 - Awful to 5 - Awesome!)"
				}, function(error, message) {
					if(!error) {
						console.log("Message successfully sent with SID: ");
						console.log(message.sid);

						console.log("Message sent on: ");
						console.log(message.dateCreated);
					} else {
						console.log("Error sending message");
						console.log(err);
					}
				})
			}
		});
	} else {
		console.log("Worker.js :: It's a vacation, baby!");
	}		
}

/*
function sendReminder() {

	// check if work day
	if(!utils.isVacation())
	{
		var users = collection.distinct("username", function(err, result) {
			for(var i = 0; i < result.length; i++){
				collection.findOne({"username":result[i]}, function(err, entries) {
					console.log(entries.phonenumber);
					client.sms.messages.create({
						to : entries.phonenumber,
						from : config.twilio.number,
						body : "How was work today? (1 - Awful to 5 - Awesome!)"
					}, function(error, message) {
						if(!error) {
							console.log("Message successfully sent with SID: ");
							console.log(message.sid);


							console.log("Message sent on: ");
							console.log(message.dateCreated);
						} else {
							console.log("Error sending message");
							console.log(err);
						}
					});
				});
			}
		});
	} else {
		console.log("Worker.js :: It's a vacation, baby!");
	}			
}*/

function testSender() {
	if(!utils.isVacation())
	{
		console.log("Test");
	} else {
		console.log("Worker.js :: It's a vacation, baby!");

	}
}

//testSender();
sendReminder();