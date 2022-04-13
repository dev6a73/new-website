var express = require('express');
var router = express.Router();
var exec = require("child_process").exec;

// GET home page.
router.get('/', function(req, res){
  res.render('index', { title: 'Hello, World!'});
});

router.get('/platform_game', function(req, res) {
  res.set('Content-Security-Policy', "default-src 'self' 'unsafe-hashes' 'unsafe-inline'; style-src 'unsafe-inline' 'self'; script-src 'unsafe-inline' 'self' 'https://unpkg.com/@babel/standalone/babel.min.js';")
  res.render('platform_game', { title: 'platform game'});
});

router.get('/shooting_game', function(req, res) {
  res.render('shooting_game', { title: 'shooting game'});
});

router.get('/index.html', function(req, res) {
  res.redirect('/')
});

module.exports = router;
