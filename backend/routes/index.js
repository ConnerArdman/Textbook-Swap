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

router.post('/signup', function(req, res, next) {
    var Email = req.body.email; 
    var Phone = req.body.phone;
    if (Phone.substr(0, 2) != "+1"){
        Phone = "+1"+Phone;
    }
    var Password = req.body.password;
    var Name = req.body.username; 

    console.log(req.body, "may or may not be undefined");

    console.log("Email = " + Email);
    console.log("Phone = " + Phone);
    console.log("Password = " + Password);
    console.log("Display name = " + Name);


    if (Email === undefined || Phone === undefined || Password === undefined || Name === undefined){
        console.log("Post did not contain a necessary param.");
        res.status('400').end();
    } else {
        console.log("Attempting to create a new user");
        admin.auth().createUser({
            email: Email,
            phoneNumber: Phone,
            password: Password,
            displayName: Name,
        })
      .then(function(userRecord) {
        // See the UserRecord reference doc for the contents of userRecord.
        console.log("Successfully created new user:", userRecord.uid);

        admin.auth().createCustomToken(userRecord.uid)
          .then(function(customToken) {
            // Send token back to client
          })
          .catch(function(error) {
            console.log("Error creating custom token:", error);
          });

        res.status('201').end();
      })
      .catch(function(error) {
        console.log("Error creating new user:", error);
        res.status('500').end();
      });
    }
});


router.post('/login', function(req, res, next) {
    console.log("Login request: ", req.body);
    admin.auth().getUserByEmail(req.body.email)
      .then(function(userRecord) {
        // See the UserRecord reference doc for the contents of userRecord.
        console.log("Successfully fetched user data:", userRecord.toJSON());
        // check password and send auth token if they match
        console.log(userRecord);
        admin.auth().createCustomToken(userRecord.uid)
          .then(function(customToken) {
            // Send token back to client
          })
          .catch(function(error) {
            console.log("Error creating custom token:", error);
          });


        res.status('201').end();
      })
      .catch(function(error) {
        console.log("Error fetching user data:", error);
        res.status('500').end();

      });

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
