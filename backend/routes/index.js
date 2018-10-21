var express = require('express');
var router = express.Router();

/* set up Firebase */
var admin = require('firebase-admin');

var serviceAccount = require('./firebase_admin_key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://textbook-match.firebaseio.com/'
});



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login', function(req, res, next) {
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({ "books_required" : [ 9780262033848,  9780133594140, 0393918858 ],
  							"books_owned" : [ 9780133594140,  9780199651566, 1138127043 ]} ));
});

router.get('/books', function(req, res, next) {
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({ "books_required" : [ 9780262033848,  9780133594140, 0393918858 ],
  							"books_owned" : [ 9780133594140,  9780199651566, 1138127043 ]} ));
});


router.post('/book_owned', function(req, res, next) {
  res.status('201').end();
});

router.post('/book_required', function(req, res, next) {
  res.status('201').end();
});


module.exports = router;
