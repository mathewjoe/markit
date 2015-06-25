var express = require('express');
var router = express.Router();

//Retrieving models
var bookmarks = require('../models/bookmark');

router.use('/:id', function (req, res, next) {
	//retrieve details of bookmark with given id from DB and attach it to the req object.
	bookmarks.findById(req.params.id, function (err, bookmark) {
		if(!err && bookmark) {
			req.bookmark = bookmark;
			next()
		}
		else {
			var err = new Error('not found')
			err.status = 404
			next(err)
		}
	})
})

router.get('/', function (req, res, next) {
	//list all bookmarks
	bookmarks.find(function (err, result) {
		if(!err)
			res.json(result);
		else
			next(err)
	})
});

router.post('/', function (req, res, next) {
	//create a new bookmark and respond with details of the bookmark created. Accept post parameters : title, url
	bookmarks.create(req.body, function (err, result) {
		if(!err)
			res.json(result);
		else
			next(err)
	})
});

router.get('/:id', function (req, res, next) {
	//respond with details of the bookmark with given id
	res.json(req.bookmark);
})

router.put('/:id', function (req, res, next) {
	//Update the bookmark in DB with the given details. Accept post parameters : title, url
	req.body.updated = Date.now()
	bookmarks.findByIdAndUpdate(req.params.id, req.body, function (err, result) {
		if(!err)
			res.json(result);
		else
			next(err)
	})
})

router.delete('/:id', function (req, res, next) {
	//Delete bookmark from DB
	bookmarks.findByIdAndRemove(req.params.id, function (err, result) {
		if(!err)
			res.json(result)
		else
			next(err)
	})
})

router.use(function (err, req, res, next) {
	res.status(err.status || 500)
	res.json({
		error : true,
		message : err.message
	});
})

module.exports = router;
