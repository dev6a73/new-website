var express = require('express');
var router = express.Router();

// GET home page.
router.get('/', function(req, res) {
  res.sendFile("index.html", {root: "html"})
  express.static(__dirname + '/public')
});

router.get('/index.html', function(req, res) {
  res.redirect('/')
});

router.get('/platform game.html', function(req, res) {
  res.sendFile("platform game.html", {root: "html"})
  express.static(__dirname + '/public')
});

router.get('/shooting game.html', function(req, res) {
  res.sendFile("shooting game.html", {root: "html"})
  express.static(__dirname + '/public')
});

module.exports = router;
