var express = require('express');
var router = express.Router();

var User = require('../models/user');

const checkAuth = require('../middleware/check-auth');
const jwt = require('jsonwebtoken');

router.get('/checkforexistence', (req, res) => {

    var plateNumber = req.body.plateNumber;

    req.checkBody('platenumber', 'O número da placa é obrigatório').notEmpty();

    var errors = req.validationErrors();

    if (errors) {
        res.send(errors);
    } else {
        User.getUserByPlate(plateNumber, function (err, user) {
            if (err)
                throw err;
            if (!user) {
                res.send('Placa não encontrada');
            } else {
                res.json({
                    user
                });
            }
        });
    }
});

module.exports = router;