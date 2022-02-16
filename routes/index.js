var express = require('express');
var router = express.Router();
var exec = require("child_process").exec;

// GET home page.
router.get('/', function(req, res){
  exec("php html/index.php", function (error, stdout, stderr) {
    res.send(stdout);
  });
  express.static(__dirname + '/public')
});

router.get('/platform game.html', function(req, res) {
  res.sendFile("platform game.html", {root: "html"})
  express.static(__dirname + '/public')
});

router.get('/shooting game.html', function(req, res) {
  res.sendFile("shooting game.html", {root: "html"})
  express.static(__dirname + '/public')
});

router.get('/index.html', function(req, res) {
  res.redirect('/')
});

module.exports = router;
