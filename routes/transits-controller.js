var express = require('express');
var router = express.Router();
var Transit = require('../models/transit')
const checkAuth = require('../middleware/check-auth');
const jwt = require('jsonwebtoken');
var constant = require('../helpers/constants')

router.get('/list', (req, res) => {
    console.log('\nlist transit: ')
    console.log('headers: ' + req.headers['token'])
    console.log(req.param('userId'))

    jwt.verify(req.headers['token'], constant.JWT_PUBLIC_KEY, function (err, decoded) {
        if (err) {
            console.log(err)
            res.send({
                success: false,
                error: [{
                    'param': req.headers['token'],
                    'msg': 'O token é inválido'
                }]
            })
        } else {
            console.log(decoded)
        }
    });

    var userId = req.param('userId');

    if (!userId) {
        res.send({
            success: false,
            error: [{
                'param': userId,
                'msg': 'O id do usuário é obrigatório'
            }]
        })
    } else {
        Transit.getByUserId(userId, function (err, transits) {
            if (err)
                throw err;
            if (!transits) {
                return res.json({
                    success: false,
                    error: [{
                        msg: 'Não foram encontrados históricos de entradas e saídas.'
                    }]
                })
            } else {
                return res.json({
                    success: true,
                    data: transits,
                    error: []
                })
            }
        });
    }
});

router.get('/countOfToday', (req, res) => {
    console.log('\nlist transit: ')
    console.log('headers: ' + req.headers['token'])
    console.log(req.param('userId'))

    jwt.verify(req.headers['token'], constant.JWT_PUBLIC_KEY, function (err, decoded) {
        if (err) {
            console.log(err)
            res.send({
                success: false,
                error: [{
                    'param': req.headers['token'],
                    'msg': 'O token é inválido'
                }]
            })
        } else {
            console.log(decoded)
        }
    });

    var userId = req.param('userId');

    if (!userId) {
        res.send({
            success: false,
            error: [{
                'param': userId,
                'msg': 'O id do usuário é obrigatório'
            }]
        })
    } else {
        Transit.getCountByToday(userId, function (err, transits) {
            if (err)
                throw err;
            if (!transits) {
                return res.json({
                    success: false,
                    error: [{
                        msg: 0
                    }]
                })
            } else {
                return res.json({
                    success: true,
                    data: transits,
                    error: []
                })
            }
        });
    }
});

module.exports = router;