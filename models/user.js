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

module.exports = mongoose.model('User', userSchema);