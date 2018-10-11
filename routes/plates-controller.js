var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Token = require('../models/token');
var Transit = require('../models/transit')
const checkAuth = require('../middleware/check-auth');
const jwt = require('jsonwebtoken');
const multer = require('multer')

var FCM = require('fcm-node');
var serverKey = 'AAAA6ACQL1Y:APA91bG_a8Mk9WAZ0AJ46ZzJzj9xVi3LuXAOjeSYrWqeW9UDdg7XmzIq2eVSDLkC_yI7dD-uX4332fGqKtuBJvx12u3nLEQi_Pa7b8rlEix1A5KcwEh79V4vhduC-_kQ8Z01L9Gux8hu';
var fcm = new FCM(serverKey);

router.post('/checkforexistence', (req, res) => {

    console.log('check for existence:')
    var plate = req.body.plate;
    var img = req.body.img;
    var barrierId = req.body.barrierId;

    req.checkBody('plate', 'O número da placa é obrigatório').notEmpty();
    req.checkBody('barrierId', 'O número da cancela é obrigatório').notEmpty();

    var errors = req.validationErrors();

    if (errors) {
        res.send(errors);
    } else {
        User.getApprovedUserByPlate(plate, function (err, user) {
            if (err)
                throw err;
            if (!user) {
                return res.json({
                    success: false,
                    error: [{
                        msg: 'Placa não encontrada.'
                    }]
                })
            } else {
                var newTransit = new Transit({
                    userId: user._id,
                    img: img,
                    automaticBarrierId: barrierId,
                    automaticBarrierLocatioName: 'Universidade Positivo',
                    date: new Date()
                })

                Transit.create(newTransit, function (err, transit) {
                    if (err) throw err;
                    console.log(transit);
                });

                console.log(user._id.toString());
                Token.getTokenByUserId(user._id.toString(), function(err, token) {
                    if (err) throw err;
                    console.log(token)
                    console.log(token.token)
                    var message = {
                        to: token.token,
                        notification: {
                            title: 'Cancela automática',
                            body: 'Veículo autorizado a transitar pela cancela'
                        },
                        data: {
                            my_key: user._id,
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
                });

                return res.json({
                    success: true,
                    user: user,
                    error: []
                })
            }
        });
    }
});

module.exports = router;