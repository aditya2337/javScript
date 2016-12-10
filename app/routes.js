module.exports = function( app, passport) {

	var captcha = require('../Captcha.js'),
  	captchaOptions = {

  };

	var user = require('../app/models/user'); //i get the address of user model in the link you give, but in general it should be the user model address.
  var todoActivity = require('../app/models/activity'); //i get the address of user model in the link you give, but in general it should be the user model address.

	// Home page with login links
	app.get( '/', function( req, res) {

		// check to see if the user is already logged in
		if ( req.isAuthenticated()) {
			res.render( 'mainProfile.ejs', {
				user : req.user // get the user out of session and pass to template
			});
		} else {
			res.render('index.ejs'); // load the index.ejs file
		}
	});

	app.get( '/home', function( req, res) {

		// check to see if the user is already logged in
		if ( req.isAuthenticated()) {
			res.render( 'profile.ejs', {
				user : req.user // get the user out of session and pass to template
			});
		}
		res.render('home.ejs'); // load the index.ejs file
	});

	// Login form
	app.get('/login', function( req, res) {

		// check to see if the user is already logged in
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

		// check to see if the user is already logged in
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

	app.get( '/edit', function( req, res) {
		res.render( 'editProfile.ejs', { user : req.user , message : req.flash('signupMessage')});
	});

	app.get('/captcha', function(req, res) {
		captcha(captchaOptions, function(err, data) {
			if(err) {
				res.send(err)
			}
			else {
				req.session.captcha = data.captchaStr
				res.end(data.captchaImg)
			}
		});
	});

	app.post( '/update', isLoggedIn, function(req, res) {
		user.findOne( {'local.email' : req.body.email},  function( err, docs) {
			if (err) {
				console.log(err);
				res.status(500).send();
			} else {
				if ( !docs) {
					res.status(404).send();
				} else {
					if ( req.body.fname)
						docs.local.fname = req.body.fname;

					if( req.body.lname)
						docs.local.lname = req.body.lname;

					docs.save( function( err, updatedObject) {
						if( err) {
							console.log(err);
							res.status(500).send();
						} else {
							res.redirect('/profile');
						}
					});
				}
			}
		});
	});
	app.get('/activity', isLoggedIn, function(req, res) {
		todoActivity.find({'activity.u_id' : req.user._id, 'activity.completed' : false}).exec( function (err, tasks) {
			if (err) return next(error);
			res.render( 'mainActivity.ejs', {
				user : req.user,
				message : req.flash('signupMessage'),
				tasks: tasks || []
			});
		// console.log(tasks);
		});
	});

	app.get('/completed', isLoggedIn, function(req, res) {
		todoActivity.find({'activity.u_id' : req.user._id, 'activity.completed' : true}).exec( function (err, tasks) {
			if (err) return next(error);
			res.render( 'completed.ejs', {
				user : req.user,
				message : req.flash('signupMessage'),
				tasks: tasks || []
			});
		// console.log(tasks);
		});
	});

	app.get('/actWindow', isLoggedIn, function(req, res) {
		todoActivity.find({'activity.u_id' : req.user._id, 'activity.completed' : false}).exec( function (err, tasks) {
			if (err) return next(error);
			res.render( 'activity.ejs', {
				user : req.user,
				message : req.flash('signupMessage'),
				tasks: tasks || []
			});
		})
	});

	app.post('/activity', isLoggedIn, function (req, res) {
		if (!req.body || !req.body.name) return next( new Error( 'No data provided'));
		user.findOne( {'_id' : req.user._id},  function( err, docs) {
			if (err) {
				console.log(err);
				res.status(500).send();
			} else {
				var newTodo = new todoActivity();

				// set the user's local credentials
				newTodo.activity.name = req.body.name;
				newTodo.activity.createTime = new Date();
				newTodo.activity.completed = false;
				newTodo.activity.u_id = req.user._id;

				// save the user
				newTodo.save( function(err) {
					if (err)
						throw err;
					res.redirect('/actWindow');
				});
			}
		});
	});

	app.post('/del/:task_id', isLoggedIn, function (req, res) {
		todoActivity.findByIdAndRemove( req.params.task_id, function (err, count) {
			console.log(req.params.task_id);
			if (err) return next(err);
			// res.status(204).send();
			res.redirect('/actWindow');
		});
	});

	app.post('/done/:task_id', isLoggedIn, function (req, res, next) {
		if (!req.body.completed) return next(new Error('Param is missing'));
		var completed = req.body.completed;
		todoActivity.findByIdAndUpdate( req.params.task_id, {
			$set : {
				'activity.completeTime' : completed ? new Date() : null,
				'activity.completed' : completed
			}
		}, function (err, count) {
			if (err) return next(err);
			res.redirect('/actWindow');
		});
	})
};


// route middleware to make sure a user is logged in
function isLoggedIn( req, res, next) {

	// if user is authenticated in the session, carry on
	if ( req.isAuthenticated())
		return next();

	// if they aren't, redirect them to homepage
	res.redirect('/');
}
