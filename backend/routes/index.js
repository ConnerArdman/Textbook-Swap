var express = require('express');
var router = express.Router();

/* set up Firebase */
var admin = require('firebase-admin');

var serviceAccount = require('./firebase_admin_key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://textbook-match.firebaseio.com/'
});

// on a timer, run the algo to create matchings and push resulting matchings to user phones
var pushNotifs = admin.messaging();



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
    admin.auth().getUserByEmail(req.body.email)
      .then(function(userRecord) {
        // See the UserRecord reference doc for the contents of userRecord.
        console.log("Successfully fetched user data:", userRecord.toJSON());
        // check password and send auth token if they match
        admin.auth().createCustomToken(userRecord.uid)
          .then(function(customToken) {
            // Send token back to client
            res.json ({token : customToken});
          })
          .catch(function(error) {
            console.log("Error creating custom token:", error);
            res.status('500').end();
          });
      })
      .catch(function(error) {
        console.log("Error fetching user data:", error);
        res.status('500').end();

      });

});

// store & retrieve data related to each account's wish list and books they're willing to trade
var db = admin.firestore()

// just to silence a warning
const settings = {/* your settings... */ timestampsInSnapshots: true};
db.settings(settings);


var books_required = db.collection('books_required');
var books_owned = db.collection('books_owned');

router.get('/books', function(req, res, next) {
    var Email = req.email;

    if(Email === undefined){
        console.log("Post did not contain a necessary param.");
        res.status('400').end();
    } else {
        var required = books_required.doc(Email).books;
        var owned = books_owned.doc(Email).books;
        console.log(required, owned)
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({ "books_required" : required,
                                "books_owned" : owned}));
    }
});

router.post('/book_owned', function(req, res, next) {
    var Email = req.body.email;
    var Isbn = req.body.isbn;
    if(Email === undefined || Isbn === undefined){
        console.log("Post did not contain a necessary param.");
        res.status('400').end();
    } else {
        console.log("Willing to swap book: ", Isbn);
        books_owned.doc(Email).get().then( doc => {
            if(!doc.exists) {
                console.log("Creating new record")
                var record = {
                    email: Email,
                    books: [ Isbn ]
                }
                console.log(record);
                books_owned.doc(Email).set(record);
            }
            else {
                //var record = doc.data();
                var record = doc.data();
                console.log(record);
                if (!record.books.includes(Isbn)){
                    console.log("Updating record")
                    record.books.push(Isbn);
                    console.log(record);
                    books_owned.doc(Email).set(record);
                }
                else {
                    console.log("Book already offered. Not updating");
                }            
            } 
        });
    }
    res.status('201').end();
});

router.post('/book_required', function(req, res, next) {
    var Email = req.body.email;
    var Isbn = req.body.isbn;
    if(Email === undefined || Isbn === undefined){
        console.log("Post did not contain a necessary param.");
        res.status('400').end();
    } else {
        console.log("Wants book: ", Isbn);
        books_required.doc(Email).get().then( doc => {
            if(!doc.exists) {
                console.log("Creating new record")
                var record = {
                    email: Email,
                    books: [ Isbn ]
                }
                console.log(record);
                books_required.doc(Email).set(record);
            }
            else {
                var record = doc.data();
                console.log(record);
                if (!record.books.includes(Isbn)){
                    console.log("Updating record")
                    record.books.push(Isbn);
                    console.log(record);
                    books_required.doc(Email).set(record);
                }
                else {
                    console.log("Book already requested. Not updating");
                }            
            } 
        });
    }
    res.status('201').end();
});


module.exports = router;
