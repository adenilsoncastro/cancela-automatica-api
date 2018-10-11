var express = require('express');
var router = express.Router();

var User = require('../models/user');
var Transit = require('../models/transit')

const checkAuth = require('../middleware/check-auth');
const jwt = require('jsonwebtoken');

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

                Token.getTokenByUserId('teste', function(err, token) {
                    if (err) throw err;

                    var message = {
                        to: 'eoD2CuXccYs:APA91bFGg9sLa7ZTHg31_88OxrT0WG_JZbsuta19avDVBnsoDcfPR89_J-N0xxqHQobw35mS_fj_vHrXLrFYUPjCinkb75dI9f261Bn6orweVcBv97QmmXHMYVf7x1-SSyQ7J5XHliqA',
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