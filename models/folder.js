var mongoose = require('mongoose');
var bookmark = require('./bookmark');
var bookmarkSchema = bookmark.schema;

var folderSchema = mongoose.Schema({
	name : String, 
	bookmarks : [bookmarkSchema],
	updated : { type : Date, default : Date.now }
});

var folders = mongoose.model('folder', folderSchema);

module.exports = folders;