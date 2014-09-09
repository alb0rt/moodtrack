var config = {};

config.twilio = {};

config.twilio.sid = 'ACd9736e36084695b8fe325153a9c36b8a';
config.twilio.key = '29971904e99a605f82c6733ab16e8fee';
config.twilio.smsWebhook = 'http://damp-brushlands-4755.herokuapp.com/addrating/sms';
config.twilio.voiceWebhook = 'http://damp-brushlands-4755.herokuapp.com/vote/voice';
config.disableTwilioSigCheck = false;

module.exports = config;
