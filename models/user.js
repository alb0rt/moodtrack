var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
	username	: String,
	password	: String,
	phonenumber : String

}, {collection : 'users'});

userSchema.methods.generateHash = function(password, next) {
	bcrypt.hash(password, bcrypt.genSaltSync(8), null, next);
};
/*
userSchema.methods.validPassword = function(password, next) {
	bcrypt.compare(password, this.local.password, next);
};*/

// Sync method for validating password, will need to switch to async at some point
userSchema.methods.validPassword = function(password) {
	return bcrypt.compareSync(password, this.password);
};

// Phone number may not have country code, normalize to e.164 format
userSchema.methods.formatPhone = function(phone) {
	var e164Phone = phone;

	var reCountryCode = /^([0-9]{10})$/;
	if(e164Phone.match(reCountryCode)) {
		e164Phone = "+1" + e164Phone;
	}

	var reE164 = /^([0-9]{11})$/;
	if(e164Phone.match(reE164)) {
		e164Phone = "+" + e164Phone;
	}

	return e164Phone;
};

module.exports = mongoose.model('User', userSchema);