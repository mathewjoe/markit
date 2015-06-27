var express = require('express');
var router = express.Router();
var path = require('path');

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

router.get('/', function (req, res, next) {
	res.sendFile(path.join(__dirname + '/../views/index.html'));
})

router.get('/test', function (req, res, next) {
	res.sendFile(path.join(__dirname + '/../views/test.html'));
})


module.exports = router;
