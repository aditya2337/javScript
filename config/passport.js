// load all the things we need
var LocalStrategy = require( 'passport-local').Strategy;

// load up the user model
var User = require('../app/models/user');

// expose this function to our app using module.exports
module.exports = function( passport) {
	// PASSPORT SESSION SETUP
	// required for persistent login sessions
	// passport needs ability to serialize and unserialize users out of session

	// used to serialize the user for the session
	passport.serializeUser( function( user, done) {
		done( null, user.id);
	});

	// used to deserialize user
	passport.deserializeUser( function( id, done) {
		User.findById( id, function( err, user) {
			done( err, user);
		});
	});

	// LOCAL SIGNUP
	// we are using named strategies since we would have one login and one for signup
	// by default, if there was no name, it would be just called 'local'

	passport.use( 'local-signup', new LocalStrategy({
		// by default, local strategy uses username and password, we will replace it with email
		usernameField : 'email',
		passwordField : 'password',
		passReqToCallback : true // allows us to pass the entire request to the callback
	},
	function( req, email, password, done) {
    console.log(req.body);
		// asynchronous
		// User.findOne wont fire unless data is sent back
		process.nextTick( function() {


			// find a user whose email is the same as the forms email
			User.findOne({ 'local.email' : email}, function( err, user) {
				// if there are any errors, return the error
				if (err)
					return err;

        var fname = req.body.fname;
        var lname = req.body.lname;
        var cpassword = req.body.cpassword;

				// check to see if theres already a user with that email
				if ( user) {
					return done( null, false, req.flash( 'signupMessage', 'That email is already taken '));
				} else if( cpassword != password){
          return done( null, false, req.flash( 'signupMessage', 'Oops! the passwords don\'t match '));
        } else if ( !validateEmail( email)){
          return done( null, false, req.flash( 'signupMessage', 'The email submitted is not a valid one! '));
        } else if ( req.session && req.session.captcha && req.body.captcha && req.session.captcha.toLowerCase() !== req.body.captcha.toLowerCase()){
          return done( null, false, req.flash( 'signupMessage', 'The captcha is wrong, Please try again! '));
        } else {

					// if there is no user with that email
          // create the user
          var newUser = new User();

          // set the user's local credentials
          newUser.local.fname = fname;
          newUser.local.lname = lname;
          newUser.local.email = email;
          newUser.local.password = newUser.generateHash( password);

          // save the user
          newUser.save( function(err) {
          	if (err)
          		throw err;
          	return done( null, newUser);
          });
				}
			});
		});
	}));

	// LOCAL LOGIN
	// we are using named strategies since we have one for login and one for signup
  // by default, if there was no name, it would just be called 'local'

  passport.use( 'local-login', new LocalStrategy({
  	// by default, local strategy uses username and password, we will override with email
  	usernameField : 'email',
  	passwordField : 'password',
  	passReqToCallback : true // allows us to pass back the entire request to the callback
  },
  function( req, email, password, done) {
  	// find a user whose email is the same as the forms email
    // we are checking to see if the user trying to login already exists
    User.findOne({ 'local.email' : email}, function( err, user) {
    	// if there are any errors, return the error before anything else
      if (err)
          return done(err);

      // if no user is found, return the message
      if ( !user)
      	return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash

      // if the user is found but the password is wrong
      if (!user.validPassword(password))
      	return done( null, false, req.flash( 'loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flash message.

      // all is well, return successful user
      return done( null, user);
    });
  }));

  passport.use( 'local-update', new LocalStrategy({
    // by default, local strategy uses username and password, we will replace it with email
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true // allows us to pass the entire request to the callback
  },
  function( req, email, password, done) {
    // asynchronous
    // User.findOne wont fire unless data is sent back
    process.nextTick( function() {

      var fname = req.body.fname;
      var lname = req.body.lname;

      // find a user whose email is the same as the forms email

      User.update( {_id: req.body.userid}, {
        'local.fname': req.body.fname
      }, function( err, numberAffected, rawResponse) {
        if (err)
          return done( null, false, req.flash( 'updateMessage', err));

        console.log(req.session.passport.user);
        return done( null, user);
      });
    });
  }));
};

// Check to see if the email is valid, using a regular expression.
function validateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}
