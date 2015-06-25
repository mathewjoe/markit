var mongoose = require('mongoose');

var bookmarkSchema = mongoose.Schema({
	title : String,
	url : String,
	organized : { type : Boolean, default : false },
	updated : { type : Date, default : Date.now }
});

var bookmarks = mongoose.model('bookmark', bookmarkSchema);

module.exports = bookmarks;