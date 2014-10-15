var express = require('express');
var router = express.Router();
var twilio = require('twilio');
var config = require('./config');
var utils = require('./utils');


function testfunction() {
	console.log(utils.generateResponse("3"));

}

testfunction();