module.exports = {
    // looks like mongodb://<user>:<pass>@mongo.localhost:27017/aditya
    'url' : process.env.MONGOLAB_URI || 'mongodb://localhost/passport' 
};