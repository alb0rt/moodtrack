var twilio = require('twilio');
var config = require('./config');
var client = new twilio.RestClient(config.twilio.sid, config.twilio.key);

var mongo = require('mongoskin');
var db = "";

if(process.env.ENV == 'development') {
    db = mongo.db("mongodb://localhost:27017/moodtrack", {native_parser:true});
} else {
    db = mongo.db("mongodb://skronch:qwe123@ds035270.mongolab.com:35270/heroku_app29348857", {native_parse:true});	
}

var collection = db.collection("moodtrack");

function sendReminder() {
	var users = collection.distinct("username", function(err, result) {
		for(var i = 0; i < result.length; i++){
			collection.findOne({"username":result[i]}, function(err, entries) {
				console.log(entries.phonenumber);
				client.sms.messages.create({
					to : entries.phonenumber,
					from : config.twilio.number,
					body : "Testing multi-broadcast"
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
		


/*
	client.sms.messages.create({
		to : '+12036450330',
		from : config.twilio.number,
		body : 'How was work today?'
	}, function(error, message) {
		if(!error) {
			console.log("Message successfully sent with SID: ");
			console.log(message.sid);

			console.log("Message sent on: ");
			console.log(message.dateCreated);
		} else {
			console.log("Error sending message");
		}
	});

	client.sms.messages.create({
		to : '+12034346561',
		from : config.twilio.number,
		body : 'How was work today?'
	}, function(error, message) {
		if(!error) {
			console.log("Message successfully sent with SID: ");
			console.log(message.sid);

			console.log("Message sent on: ");
			console.log(message.dateCreated);
		} else {
			console.log("Error sending message");
		}
	});*/
}

sendReminder();