var express = require('express');
var router = express.Router();

//Retrieving models
var folders = require('../models/folder');

router.use('/:id', function (req, res, next) {
	//retrieve details of folder with given id from DB and attach it to the req object.
	folders.findById(req.params.id, function (err, folder) {
		if(!err && folder){
			req.folder = folder;
			next();
		}
		else {
			var err = new Error('not found')
			err.status = 404
			next(err)
		}
	})
})

router.get('/', function (req, res, next) {
	//list all folders
	folders.find(function (err, result) {
		if(!err)
			res.json(result);
		else
			next(err)
	})
});

router.post('/', function (req, res, next) {
	//create a new folder and respond with details of the folder created. Accept post parameters : name
	folders.create(req.body, function (err, result) {
		if(!err)
			res.json(result);
		else
			next(err)
	})
});

router.get('/:id', function (req, res, next) {
	//respond with details of the folder with given id
	res.json(req.folder);
})

router.put('/:id', function (req, res, next) {
	//Update the folder in DB with the given details. Accept post parameters : name, [bookmark_ids]
	req.body.updated = Date.now();
	folders.findByIdAndUpdate(req.params.id, req.body, function (err, result) {
		if(!err)
			res.json(result);
		else
			next(err)
	})
})

router.delete('/:id', function (req, res, next) {
	//Delete folder from DB
	folders.findByIdAndRemove(req.params.id, function (err, result) {
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