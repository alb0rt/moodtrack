// set up

var express     = require('express');
var app         = express();
var path        = require('path');
var favicon     = require('serve-favicon');
var logger      = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser  = require('body-parser');
var passport    = require('passport');
var session     = require('express-session');
var flash       = require('connect-flash');

var routes      = require('./routes/index');
var users       = require('./routes/users');

var configDB    = require('./config/database');
var mongoose    = require('mongoose');


// Database
var mongo = require('mongoskin');
var db = "";

if (app.get('env') === 'development') {
    db = mongo.db("mongodb://localhost:27017/moodtrack", {native_parser:true});
    mongoose.connect('mongodb://localhost:27017/moodtrack');
    console.log("Connecting to Test Mongo");
} else {
    db = mongo.db("mongodb://skronch:qwe123@ds035270.mongolab.com:35270/heroku_app29348857", {native_parse:true});
    mongoose.connect('mongodb://skronch:qwe123@ds035270.mongolab.com:35270/heroku_app29348857');
    console.log("Connecting to Prod Mongo");
}

//mongoose.connect(configDB.urlTest);


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
    req.db = db;
    next()
});

// initialize passport related set-up
require('./config/passport')(passport);
app.use(session({secret: 'moodtrackhahaha'}))
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// routes

require('./routes/index')(app, passport);
//app.use('/', routes);
//app.use('/users', users);

app.all('*', function(req, res) {
    res.status(404).end();
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
