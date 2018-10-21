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
        // TODO: check passcode and 
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


// The following maps go from keys to lists of values 
// map book ISBNs -> user emails
var books_required = db.collection('books_required');
var books_owned = db.collection('books_owned');

// maps user emails -> book ISBNs 
var users_wanting_book = db.collection('users_wanting_book');
var users_with_book = db.collection('users_with_book');

// maps user emails -> notifications that they'll get when they make an API request for notifications
var notifications = db.collection('notifications')

// Table is a map from a key to a list of values.
// If key exists in table, add value to the list. 
// Otherwise, make a new entry in table: key -> [value]
function upsert(table, keyName, key, valueListName, value) {
    table.doc(key).get().then( doc => {
        console.log("upserting value", value, " into list:", valueListName);
        if (!doc.exists) {
            console.log("Creating new record");
            var record = {};
            record[keyName]=key;
            record[valueListName]= [value];
            table.doc(key).set(record);
        } else {
            var record = doc.data();
            if (!record[valueListName].includes(value)){
                console.log("Updating existing record");
                record[valueListName].push(value);
                table.doc(key).set(record); 
            } else {
                console.log("Record already exists. Not updating");
            }
        }
    });
}

// this code runs periodically
setInterval(function(){
    books_required.get().then(all_books_required => {
        books_owned.get().then(all_books_owned => {
            users_wanting_book.get().then(all_users_wanting_book => {
                users_with_book.get().then(all_users_with_book => {
                    // erin's code goes here
                })
            })
        })
    })
}, 1200000 /*every 20 mins*/);

router.get('/notifications', function(req, res, next){
    var Email = req.body.email;
    if(Email === undefined){
        console.log("Post did not contain a necessary param.");
        res.status('400').end();
    } else {
            var notifications = notifications.doc(Email).get().then( doc => {
            
            console.log(required, owned)
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({ "notfications": notifications}));
        });
    }
});

router.get('/books', function(req, res, next) {
    var Email = req.query.email;

    if(Email === undefined){
        console.log("Post did not contain a necessary param.");
        res.status('400').end();
    } else {
        books_required.doc(Email).get().then( required => {
            books_owned.doc(Email).get().then( owned => {
                req = ""
                own = ""
                if (required.exists) {
                    req = required.data().books;
                }
                if (owned.exists){
                    own = owned.data().books;
                }
                console.log(req, own)
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify({ "books_required" : req,
                        "books_owned" : own}));
            });
        });
    }
});


router.post('/book_owned', function(req, res, next) {
    var Email = req.body.email;
    var Isbn = req.body.isbn;
    if(Email === undefined || Isbn === undefined){
        console.log("Post did not contain a necessary param.");
        res.status('400').end();
    } else {
        upsert(books_owned, "email", Email, "books", Isbn);
        upsert(users_with_book, "book", Isbn, "emails", Email); 
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
        upsert(books_required, "email", Email, "books", Isbn);
        upsert(users_wanting_book, "book", Isbn, "emails", Email); 
    }
    res.status('201').end();
});


module.exports = router;
