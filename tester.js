var express = require('express');
var router = express.Router();
var twilio = require('twilio');
var config = require('./config');
var utils = require('./utils');
var client = new twilio.RestClient(config.twilio.sid, config.twilio.key);


function testfunction() {
	console.log(utils.generateResponse("3", 2.34));

}

function testMessage() {
	client.sms.messages.create({
		to : 12036450330,
		from : config.twilio.number,
		body : "👍"
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
}

testMessage();
//testfunction();