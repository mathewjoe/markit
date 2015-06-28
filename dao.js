var mongoose = require('mongoose');
var fs = require('fs');
var mongouri = require('mongodb-uri');

var options = { server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } }, 
                replset: { socketOptions: { keepAlive: 1, connectTimeoutMS : 30000 } } }; 

var dbconfig = JSON.parse(fs.readFileSync('./config/dbconfig.json'))

// If MONGOLAB_URI config var is available (available in heroku), use it; else use the default config params
// This ensures that the same repo can be used to test (using mongodb on the local machine) and deploy (on heroku; uses mongolab) 
var connectionString = process.env.MONGOLAB_URI || "mongodb://"+dbconfig.host+"/"+dbconfig.dbName

var mongooseuri = mongouri.formatMongoose(connectionString);

mongoose.connect(connectionString, function (err) {
	if(err){
		console.log('Error connecting to DB')
	}
	else {
		console.log("Successfully connected to DB")
	}
})