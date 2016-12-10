// load things we need
var mongoose = require('mongoose'),
	bcrypt = require('bcrypt-nodejs');

	// define schema for our model
var	userSchema = mongoose.Schema({
	local 	  	 : {
    fname    : String,
    lname    : String,
		email 	 : String,
		password : String,
		activity   : {
			name     : String,
			createTime : Date,
			completed : Boolean,
			completeTime : Date
		}
	}
});

// methods =====================
// generating a hash

userSchema.methods.generateHash = function( password) {
	return bcrypt.hashSync( password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function( password) {
	return bcrypt.compareSync( password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model( 'User', userSchema);
