// set up ===============================================
// get all the tools that we need
var express = require('express'),
	app = express(),
	port = process.env.PORT || 2337;

var	mongoose = require('mongoose'),
	passport = require('passport'),
	flash = require('connect-flash'),
	morgan = require('morgan'),
	cookieParser = require('cookie-parser'),
	bodyParser = require('body-parser'),
	session = require('express-session'),
	configDB = require('./config/database.js');

// configuration of db ===================================

mongoose.connect( configDB.url); // connect to our database

require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use( morgan('dev')); // log every request in console
app.use( cookieParser()); // read cookies ( need for auth)
app.use( bodyParser.json()); // get information from html form
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('./public'));

app.set( 'view engine', 'ejs'); // set up ajs for templating

app.use( session( {
	secret: 'ilovescotchscotchyscotchscotch',
  resave: true,
  saveUninitialized: true
})); // session secret
app.use( passport.initialize());
app.use( passport.session()); //persistent login sessions
app.use( flash()); // use connect-flash for flash messages stored in session

// routes ==================================================

require( './app/routes.js')( app, passport); // load our routes and pass in our application

// launch ==================================================

app.listen( port);
console.log('The magic happens at port ' + port); 