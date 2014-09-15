var config = {};

config.twilio = {};

config.twilio.sid = 'ACd9736e36084695b8fe325153a9c36b8a';
config.twilio.key = '29971904e99a605f82c6733ab16e8fee';
config.twilio.number = '+12038899300';
config.twilio.smsWebhook = 'https://damp-brushlands-4755.herokuapp.com/sms';
config.twilio.voiceWebhook = 'https://damp-brushlands-4755.herokuapp.com/vote/voice';
config.disableTwilioSigCheck = false;

module.exports = config;
