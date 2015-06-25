var mongoose = require('mongoose');
var fs = require('fs');

var dbconfig = JSON.parse(fs.readFileSync('./config/dbconfig.json'))
var connectionString = "mongodb://"+dbconfig.host+"/"+dbconfig.dbName

mongoose.connect(connectionString, function (err) {
	if(err){
		console.log('Error connecting to DB')
	}
	else {
		console.log("Successfully connected to DB")
	}
})