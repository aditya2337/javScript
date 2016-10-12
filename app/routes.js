module.exports = function( app, passport) {
	
	// Home page with login links
	app.get( '/', function( req, res) {
		if ( req.isAuthenticated()) {
			res.render( 'mainProfile.ejs', {
				user : req.user // get the user out of session and pass to template
			});
		} else {
			res.render('index.ejs'); // load the index.ejs file
		}
	});

	app.get( '/home', function( req, res) {
		if ( req.isAuthenticated()) {
			res.render( 'profile.ejs', {
				user : req.user // get the user out of session and pass to template
			});
		}
		res.render('home.ejs'); // load the index.ejs file
	});

	// Login form
	app.get('/login', function( req, res) {
		if ( req.isAuthenticated()) {
			res.render( 'profile.ejs', {
				user : req.user // get the user out of session and pass to template
			});
		}
		// render the page and pass in any flash data if it exists
		res.render( 'login.ejs', { message: req.flash('loginMessage')});
	});

	// process the login form 
	app.post( '/login', passport.authenticate( 'local-login', {
		successRedirect : '/profile', // redirect to the secure profile section
		failureRedirect : '/login', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	// signup form
	app.get( '/signup', function( req, res) {

		if ( req.isAuthenticated()) {
			res.render( 'profile.ejs', {
				user : req.user // get the user out of session and pass to template
			});
		}
		// render the page and pass in any flash data if it exists
		res.render( 'signup.ejs', { message: req.flash('signupMessage')});
	});

	// process the sign up form
	app.post( '/signup', passport.authenticate('local-signup', {
		successRedirect : '/profile', // redirect to the secure profile section
		failureRedirect : '/signup', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	// PROFILE SECTION
	// We will keep this protected so you have to be logged in to visit
	// We will use route middleware to verify	this ( the isLoggedIn function)

	app.get( '/profile', isLoggedIn, function( req, res) {
		res.render( 'profile.ejs', {
			user : req.user // get the user out of session and pass to template
		});
	});

	// Logout function

	app.get( '/logout', function( req, res) {
		req.logout();
		res.redirect('/home');
	});
};


// route middleware to make sure a user is logged in
function isLoggedIn( req, res, next) {

	// if user is authenticated in the session, carry on
	if ( req.isAuthenticated())
		return next();

	// if they aren't, redirect them to homepage
	res.redirect('/');
}