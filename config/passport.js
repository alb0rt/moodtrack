var localStrategy 	= require('passport-local').Strategy;
var userModel		= require('../models/user');

module.exports = function(passport) {
	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});


	passport.deserializeUser(function(id, done) {
		userModel.findById(id, function(err, user) {
			done(err, user);
		});
	});

	passport.use('local-signup', new localStrategy({
		usernameField : 'username',
		passwordField : 'password',
		passReqToCallback : true
	}, function(req, username, password, done) {
		process.nextTick(function() {
			userModel.findOne({'username' : username}, function(err, user) {
				if (err) {
					return done(err);
				}

				if (user) {
					return done(null, false, req.flash('signupMessage', 'Sorry, that username is already taken'));
				}

				else {
					var newUser = new userModel();
					newUser.username = username;
					newUser.generateHash(password, function(err, hash) {
						if (err) 
							return done(err);
						newUser.password = hash;

						// save the user
						newUser.save(function(err) {
							if (err) 
								return done(null, newUser);
						});
					});

					newUser.save(function(err) {
						if (err) 
							throw err;
						return done(null, newUser)
					});

				}
			});
		});
	}));

	passport.use('local-login', new localStrategy({
		usernameField : 'username',
		passwordField : 'password',
		passReqToCallback : true
	}, function(req, username, password, done) {
		userModel.findOne({'username' : username}, function(err, user) {

			if (err) {
				return done(err);
			}

			if (!user) {
				console.log('no user');
				return done(null, false, req.flash('loginMessage', 'No user found.'));
			}

			if (!user.validPassword(password)) {
				return done(null, false, req.flash('loginMessage', 'Incorrect password'));
			}	

			return done(null, user);
		});
	}));
};