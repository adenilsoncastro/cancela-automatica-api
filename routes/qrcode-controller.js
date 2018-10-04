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