var mongoose = require('mongoose');

// define schema for our model
var	activitySchema = mongoose.Schema({
  activity   : {
    name     : String,
    createTime : Date,
    completed : Boolean,
    completeTime : Date,
    u_id : String
  }
});

module.exports = mongoose.model( 'Activity', activitySchema);
