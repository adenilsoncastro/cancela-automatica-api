var express = require('express');
var router = express.Router();

var mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
const url = 'mongodb://localhost:27017/loginapp';
const dbName = 'loginapp';

var FCM = require('fcm-node');
var serverKey = 'AAAAiN9rzHQ:APA91bGg2iJzfazFqX5psaysqqz3frbXuGTEGa8msCOlox87XrR8RYZNORNhhcbCSO-q45WJqNZuY__8a4ckp1Bz5IOLiKYoeL1WEod6JmjnglAyuVmPrP6gZ2aRa9WHh2ruU1hyK4ew';
var fcm = new FCM(serverKey);

router.post('/store', (req, res) => {

    var token = req.body.token;
    var userId = req.body.userId;

    MongoClient.connect(url, (err, client) => {
        if (err) throw err;
        else {
            let db = client.db(dbName);

            db.collection('tokens').remove({'userId': userId}, (err, body) => {
                if (err) throw err;
                
                db.collection('tokens').insertOne({'token': token, 'userId': userId}, (err2, body2) => {
                    client.close();
                    if (err2) throw err2;
                    res.status(200).send('');
                })
            })
        }
    });
});

router.get('/', (req, res) => {
    res.send('Notifications Test');
});

router.get('/send', function(req, res) {

    var token_array = [];

    MongoClient.connect(url, (err, client) => {
        if (err) throw err;
        else {
            let db = client.db(dbName);
            db.collection('tokens').find().toArray((err, docs) => {
                if (err) throw err;
                for(let i = 0; i < docs.length; i++) {
                    token_array.push(docs[i]);
                }
            });
        }
        client.close();
    });

    for(let i = 0; i < token_array.length; i++) {
        var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
            to: token_array[i].token,
            // collapse_key: 'your_collapse_key',

            notification: {
                title: 'Title of your push notification',
                body: 'Body of your push notification'
            },

            data: {  //you can send only notification or only data(or include both)
                my_key: 'my value',
                my_another_key: 'my another value'
            }
        };

        fcm.send(message, function (err, response) {
            if (err) {
                console.log("Something has gone wrong!");
            } else {
                console.log("Successfully sent with response: ", response);
            }
        });
    }

    res.send('send msg');
});

module.exports = router;