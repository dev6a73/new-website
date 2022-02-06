var express = require('express');
var router = express.Router();

// GET home page.
router.get('/', function(req, res) {
  res.send("<p>hello</p>")
});

module.exports = router;
