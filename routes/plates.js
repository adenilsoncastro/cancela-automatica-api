var express = require('express');
var router = express.Router();

var User = require('../models/user');
var Transit = require('../models/transit')

const checkAuth = require('../middleware/check-auth');
const jwt = require('jsonwebtoken');

router.post('/checkforexistence', (req, res) => {

    console.log('check for existence:')
    console.log(req.body)
    console.log(req.body.plate)
    var plate = req.body.plate;

    req.checkBody('plate', 'O número da placa é obrigatório').notEmpty();

    var errors = req.validationErrors();

    if (errors) {
        res.send(errors);
    } else {
        User.getUserByPlate(plate, function (err, user) {
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
                    userId : user._id,
                    automaticBarrierId : 1,
                    date : new Date()
                })

                Transit.create(newTransit, function (err, transit) {
                    if (err) throw err;
                    console.log(transit);
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