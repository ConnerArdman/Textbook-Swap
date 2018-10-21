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
var books_requested = db.collection('books_required');
var books_offered = db.collection('books_owned');

// maps user emails -> book ISBNs
var users_requesting_book = db.collection('users_wanting_book');
var users_offering_book = db.collection('users_with_book');

// maps user emails -> notifications that they'll get when they make an API request for notifications
var notifications = db.collection('notifications')

function traceback(origUser, origTitle, booksMap, usersMap) {
  var queue = [[{email: origUser, book: origTitle}]];
  while (queue.length > 0) {
    var path = queue.shift()
    if (path.length > 5) {
      return [];
    }
    var curTitle = path[path.length - 1].book;
    if (booksMap.has(curTitle)) {
      for (var user in booksMap.get(curTitle)) {
        if (usersMap.has(user)) {
          for (var title in usersMap.get(user)) {
            if (user == origUser && title == origTitle) {
              return path;
            }
            queue.push(path.concat({email: user, book: title}));
          }
        }
      }
    }
  }
}

function removeFromDatabase(trace, books_requested, books_offered, users_requesting_book, users_offering_book) {
  var prev = trace[trace.length - 1].book;
  for (var pair in trace) {
    var user = pair.email;
    var title = pair.book;
    books_offered.get(prev).splice(books_offered.get(prev).indexOf(user), 1);
    users_offering_book.get(user).splice(users_offering_book.get(user).indexOf(prev), 1);
    books_requested.get(title).splice(books_requested.get(title).indexOf(user), 1);
    users_requesting_book.get(user).splice(users_requesting_book.get(user).indexOf(title), 1);
    prev = title;
  }
}

function findMatches(username, requests, offers, books_requested, books_offered, users_requesting_book, users_offering_book) {
  if (requests.length > offers.length) {
    return [];
  }
  users_requesting_book.set(username, users_requesting_book.get(username).concat(requests));
  users_offering_book.set(username, users_offering_book.get(username).concat(offers));
  var requestMatches = [];
  // var offerMatches = [];
  for (var request in requests) {
    var requestTrace = traceback(username, request, books_offered, users_requesting_book);
    if (requestTrace.length > 0) {
      requestMatches.push(requestTrace);
      removeFromDatabase(requestTrace, books_requested, books_offered, users_requesting_book, users_offering_book);
    }
  }
  /*
  for (var offer in offers) {
    var offerTrace = traceback(username, offer, books_requested, users_offering_book);
    if (offerTrace.length > 0) {
      offerMatches.push(offerTrace);
      removeFromDatabase(requestTrace, false, books_requested, books_offered, users_requesting_book, users_offering_book);
    }
  }*/
  return requestMatches;
}
/*
{
email : asdf@jkl.com
// array of pairs of email addresses and books
// clockwise cycle order
matches : [{email: asdf@jkl.com, book : 21234135}, {email: tre@qgrg.com, book: 626452345}]
}
*/

// this code runs periodically
setInterval(function(){
    books_requested.get().then(all_books_required => {
        books_offered.get().then(all_books_owned => {
            users_requesting_book.get().then(all_users_wanting_book => {
                users_offering_book.get().then(all_users_with_book => {
                    notifications.get().then(notifs => {
                      var allMatches = [];
                      console.log(all_users_wanting_book)
                      var usersIt = all_users_wanting_book.data().keys();
                      console.log(usersIt);
                      for (let user = usersIt.next(); user.done != true; user = usersIt.next()) {
                        var username = user.value;
                        var userMatches = findMatches(username, all_users_wanting_book.get(username), all_books_required, all_books_owned, all_users_wanting_book, all_users_with_book);
                        if (userMatches.length > 0) {
                          allMatches.push(userMatches);
                        }
                      }
                      for (var match in allMatches) {
                        for (var pair in match) {
                          var username = pair.email;
                          if (notifications.has(username)) {
                            notifications.get(username).push(match);
                          } else {
                            notifications.set(username, [match]);
                          }
                        }
                      }
                    })
                })
            })
        })
    })
}, 2000 /*1200000 every 20 mins*/);

// Table is a map from a key to a list of values.
// If key exists in table, add value to the list.
// Otherwise, make a new entry in table: key -> [value]
function upsert(table, keyName, key, valueListName, value) {
    return table.doc(key).get().then( doc => {
        console.log("upserting value", value, " into list:", valueListName);
        if (!doc.exists) {
            console.log("Creating new record");
            var record = {};
            record[keyName]=key;
            record[valueListName]= [value];
            table.doc(key).set(record);
            return true;
        } else {
            var record = doc.data();
            if (!record[valueListName].includes(value)){
                console.log("Updating existing record");
                record[valueListName].push(value);
                table.doc(key).set(record);
                return true;
            } else {
                console.log("Record already exists. Not updating");
                return false;
            }
        }
    });
}

router.get('/notifications', function(req, res, next){
    var Email = req.query.email;
    if(Email === undefined){
        console.log("Post did not contain a necessary param.");
        // for now, send dummy data
        res.send(JSON.stringify({ "notifications" : [ [{email : "yaacov.tarko@ucla.edu", book : "0131175327"}, {email : "eperrine@stanford.edu", book: "0385333846"} ] ]}));
        //res.status('400').end();
    } else {
            notifications.doc(Email).get().then( doc => {

            res.setHeader('Content-Type', 'application/json');
            if (doc.exists){
                console.log(doc.data().matches)
                res.send(JSON.stringify({ "notifications": doc.data().matches}));
            } else {
            // for now, send dummy data
                res.send(JSON.stringify({ "notifications" : [ [{email : "yaacov.tarko@ucla.edu", book : "0131175327"}, {email : "eperrine@stanford.edu", book: "0385333846"} ] ]}));
            }
        });
    }
});

router.get('/books', function(req, res, next) {
    var Email = req.query.email;

    if(Email === undefined){
        console.log("Post did not contain a necessary param.");
        res.status('400').end();
    } else {
        books_requested.doc(Email).get().then( required => {
            books_offered.doc(Email).get().then( owned => {
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
        var updated1 = upsert(books_offered, "email", Email, "books", Isbn);
        var updated2 = upsert(users_offering_book, "book", Isbn, "emails", Email);
        updated1.then( worked => {
            updated2.then( worked => {
                // respond 201 whether or not it was a duplicate, for now
                res.status('201').end();
            });
        });
    }
});

router.post('/book_required', function(req, res, next) {
    var Email = req.body.email;
    var Isbn = req.body.isbn;
    if(Email === undefined || Isbn === undefined){
        console.log("Post did not contain a necessary param.");
        res.status('400').end();
    } else {
        var updated1 = upsert(books_requested, "email", Email, "books", Isbn);
        var updated2 = upsert(users_requesting_book, "book", Isbn, "emails", Email);
        updated1.then( worked => {
            updated2.then( worked => {
                // respond 201 whether or not it was a duplicate, for now
                res.status('201').end();
            });
        });
    }
});


module.exports = router;
