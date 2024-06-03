var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/users.html', function(req, res, next) {
  res.render('users', { title: '7777' });
});

module.exports = router;