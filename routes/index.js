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

router.get('/platform_game.php', function(req, res) {
  exec("php html/platform_game.php", function (error, stdout, stderr) {
    res.send(stdout);
  });
  express.static(__dirname + '/public')
});

router.get('/shooting_game.php', function(req, res) {
  exec("php html/shooting_game.php", function (error, stdout, stderr) {
    res.send(stdout);
  });
  express.static(__dirname + '/public')
});

router.get('/index.php', function(req, res) {
  res.redirect('/')
});

module.exports = router;
