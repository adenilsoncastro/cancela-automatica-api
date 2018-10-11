var express = require('express');
var router = express.Router();

var User = require('../models/user');
var Transit = require('../models/transit')

const checkAuth = require('../middleware/check-auth');
const jwt = require('jsonwebtoken');
var Token = require('../models/token');

var FCM = require('fcm-node');
var serverKey = 'AAAA6ACQL1Y:APA91bG_a8Mk9WAZ0AJ46ZzJzj9xVi3LuXAOjeSYrWqeW9UDdg7XmzIq2eVSDLkC_yI7dD-uX4332fGqKtuBJvx12u3nLEQi_Pa7b8rlEix1A5KcwEh79V4vhduC-_kQ8Z01L9Gux8hu';
var fcm = new FCM(serverKey);

router.post('/checkgeneratedid', (req, res) => {

    console.log('check for existence of id:')
    console.log(req.body)
    console.log(req.body.generatedId)
    var generatedId = req.body.generatedId;
    var barrierId = 1;

    req.checkBody('generatedId', 'O id do usuário é obrigatório').notEmpty();

    var errors = req.validationErrors();

    if (errors) {
        res.send(errors);
    } else {
        User.getApprovedUserById(generatedId, function (err, user) {
            if (err)
                throw err;
            if (!user) {
                return res.json({
                    success: false,
                    error: [{
                        msg: 'Id não encontrado.'
                    }]
                })
            } else {
                var newTransit = new Transit({
                    userId: user._id,
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
                    
                    var message = {
                        to: token.token,
                        notification: {
                            title: 'Cancela automática',
                            body: 'Veículo autorizado a transitar pela cancela'
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