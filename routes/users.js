var express = require('express');
var router = express.Router();

var User = require('../models/user');

const checkAuth = require('../middleware/check-auth');
const jwt = require('jsonwebtoken');

router.post('/login', (req, res) => {

    var username = req.body.username;
    var password = req.body.password;

    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();

    var errors = req.validationErrors();

    if (errors) {
        res.send(errors);
    } else {
        User.getUserByUsernameAndPassword(username, password, function (err, user) {
            if (err)
                throw err;
            if (!user) {
                res.send('Usuario nao encontrado');
            } else {
                jwt.sign({
                    user
                }, process.env.JWT_KEY, {
                    expiresIn: '1d'
                }, (err, token) => {
                    res.json({
                        token
                    });
                });
            }
        });
    }
});

router.post('/register', function (req, res) {
    console.log(req.body)
    var name = req.body.name;
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    var password2 = req.body.password2;
    var marca = req.body.marca;
    var modelo = req.body.modelo;
    var placa = req.body.placa;

    req.checkBody('name', 'Nome é obrigatório').notEmpty();
    req.checkBody('email', 'E-mail é obrigatório').notEmpty();
    req.checkBody('username', 'Nome de usuário é obrigatório').notEmpty();
    req.checkBody('password', 'A senha é obrigatório').notEmpty();
    req.checkBody('password confirmation', 'A confirmação da senha é obrigatório').notEmpty();
    req.checkBody('password confirmation', 'As senhas não conferem').equals(req.body.password);
    req.checkBody('marca', 'A marca é obrigatória').notEmpty();
    req.checkBody('modelo', 'O modelo é obrigatório').notEmpty();
    req.checkBody('placa', 'A placa é obrigatório').notEmpty();

    var errors = req.validationErrors();

    if (req.validationErrors()) {
        return res.send(errors);
    }

    User.getUserByUsername(username, (err, user) => {
        if (err) throw err;

        if (user) {
            return res.json({
                message: 'Nome de usuário já cadastrado'
            })
        }

        User.getUserByUsername(username, (err, user) => {
            if (err) throw err;

            if (user) {
                return res.json({
                    message: 'Placa já cadastrada'
                })
            }

            var newUser = new User({
                name: name,
                email: email,
                username: username,
                password: password,
                marca: marca,
                modelo: modelo,
                placa: placa
            });

            User.createUser(newUser, function (err, user) {
                if (err) throw err;
                console.log(user);
                return res.json({
                    message: 'Usuário cadastrado com sucesso'
                });
            });
        });
    });
});

module.exports = router;