var express = require('express');
var router = express.Router();
var fs = require('fs'); // Using the filesystem module
var url = require('url');

router.get('/', function (req, res, next) {
    res.render('hey this worked');
});

// define the about route
router.get('/umbrella', function (req, res) {
    res.send('About birds')
});

module.exports = router;