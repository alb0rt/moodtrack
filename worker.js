var twilio = require('twilio');
var config = require('./config');
var client = new twilio.RestClient(config.twilio.sid, config.twilio.key);

function sendReminder() {
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
	});
}

sendReminder();