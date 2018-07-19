var express = require('express');
var router = express.Router();

var User = require('../models/user');
var constant = require('../helpers/constants')
const checkAuth = require('../middleware/check-auth');
const jwt = require('jsonwebtoken');


router.post('/login', (req, res) => {

    var username = req.body.username;
    var password = req.body.password;
    var usertype = req.body.usertype;

    console.log(req.body)

    req.checkBody('username', 'O nome de usuário é obrigatório').notEmpty();
    req.checkBody('password', 'A senha é obrigatória').notEmpty();
    req.checkBody('usertype', 'O tipo de usuário é obrigatório').notEmpty();

    var errors = req.validationErrors();

    if (errors) {
        res.send(errors);
    } else {
        console.log('tentando logar: ');
        console.log('username: ' + username);
        console.log('password: ' + password);
        console.log('usertype: ' + usertype);
        User.getUserByUsernameAndPassword(username, password, usertype, function (err, user) {
            if (err)
                throw err;
            if (!user) {
                return res.json({
                    success: false,
                    error: [{
                        msg: 'Usuário não encontrado.'
                    }]
                })
            } else {
                if (!user.approved) {
                    return res.json({
                        success: false,
                        error: [{
                            msg: 'O usuário está em aprovação.'
                        }]
                    })
                }
                console.log(user._id)
                jwt.sign({
                    'user': {
                        '_id': user._id,
                        'username': user.username,
                        'password': user.password,
                        'email': user.email,
                        'name': user.name,
                        'car': {
                            'marca': user.marca,
                            'modelo': user.modelo,
                            'placa': user.placa
                        }
                    }
                }, constant.JWT_PUBLIC_KEY, {
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
    console.log('tentando registrar')
    console.log(req.body)
    var name = req.body.name;
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    var passwordConfirmation = req.body.passwordConfirmation;
    var usertype = req.body.usertype;
    var marca = req.body.car.marca;
    var modelo = req.body.car.modelo;
    var placa = req.body.car.placa;
    var approved = false;

    req.checkBody('name', 'Nome é obrigatório').notEmpty();
    req.checkBody('email', 'E-mail é obrigatório').notEmpty();
    req.checkBody('username', 'Nome de usuário é obrigatório').notEmpty();
    req.checkBody('password', 'A senha é obrigatória').notEmpty();
    req.checkBody('passwordConfirmation', 'A confirmação da senha é obrigatória').notEmpty();
    req.checkBody('passwordConfirmation', 'As senhas não conferem').equals(req.body.password);
    req.checkBody('usertype', 'O tipo de usuário é obrigatório').notEmpty();
    req.checkBody('car.marca', 'A marca é obrigatória').notEmpty();
    req.checkBody('car.modelo', 'O modelo é obrigatório').notEmpty();
    req.checkBody('car.placa', 'A placa é obrigatória').notEmpty();

    var errors = req.validationErrors();

    if (req.validationErrors()) {
        return res.send({
            success: false,
            error: errors
        });
    }

    User.getUserByUsername(username, (err, user) => {
        if (err) throw err;

        if (user) {
            return res.json({
                success: false,
                error: [{
                    msg: 'Nome de usuário já cadastrado.'
                }]
            })
        }

        User.getUserByPlate(placa, (err, user) => {
            if (err) throw err;

            if (user) {
                return res.json({
                    success: false,
                    error: [{
                        msg: 'Placa já cadastrada.'
                    }]
                })
            }

            var newUser = new User({
                name: name,
                email: email,
                username: username,
                password: password,
                marca: marca,
                modelo: modelo,
                placa: placa,
                usertype: usertype,
                approved: approved
            });

            console.log(newUser);

            User.createUser(newUser, function (err, user) {
                if (err) throw err;
                console.log(user);
                return res.json({
                    success: true,
                    message: 'Usuário cadastrado com sucesso'
                });
            });
        });
    });
});

router.post('/update', function (req, res) {
    console.log('update')
    console.log(req.body)

    var _id = req.body._id;
    var name = req.body.name;
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    var passwordConfirmation = req.body.passwordConfirmation;
    var usertype = req.body.usertype;
    var marca = req.body.car.marca;
    var modelo = req.body.car.modelo;
    var placa = req.body.car.placa;

    req.checkBody('_id', 'O _id é obrigatório').notEmpty();
    req.checkBody('name', 'Nome é obrigatório').notEmpty();
    req.checkBody('email', 'E-mail é obrigatório').notEmpty();
    req.checkBody('username', 'Nome de usuário é obrigatório').notEmpty();
    req.checkBody('password', 'A senha é obrigatório').notEmpty();
    req.checkBody('passwordConfirmation', 'A confirmação da senha é obrigatório').notEmpty();
    req.checkBody('passwordConfirmation', 'As senhas não conferem').equals(req.body.password);
    req.checkBody('usertype', 'O tipo de usuário é obrigatório').notEmpty();
    req.checkBody('car.marca', 'A marca é obrigatória').notEmpty();
    req.checkBody('car.modelo', 'O modelo é obrigatório').notEmpty();
    req.checkBody('car.placa', 'A placa é obrigatório').notEmpty();

    var errors = req.validationErrors();

    if (req.validationErrors()) {
        return res.send({
            success: false,
            error: errors
        });
    }

    User.getUserById(_id, (err, user) => {
        if (err) throw err;

        user.name = name;
        user.email = email;
        user.username = username;
        user.password = password;
        user.marca = marca;
        user.modelo = modelo;
        user.placa = placa;
        user.usertype = usertype;

        //Para ele poder trocar de placa, é necessário verificar se
        //ninguém já está usando a placa, caso contrário, uma mensagem
        //de erro será retornada
        User.getUserByPlate(placa, (err, mongouser) => {
            if (mongouser) {
                if (mongouser._doc._id != _id) {
                    return res.json({
                        success: false,
                        error: [{
                            msg: 'A placa já está cadastrada no sistema.'
                        }]
                    })
                } else {
                    User.updateUser(user, _id, function (err, user) {
                        if (err) throw err;
                        console.log(user);
                        return res.json({
                            success: true,
                            message: 'Usuário alterado com sucesso'
                        });
                    });
                }
            } else {
                User.updateUser(user, _id, function (err, user) {
                    if (err) throw err;
                    console.log(user);
                    return res.json({
                        success: true,
                        message: 'Usuário alterado com sucesso'
                    });
                });
            }
        });
    })
});

router.get('/unapproved', function (req, res) {
    console.log(req);
    console.log('get unapproved');
    User.getUnapproved((err, users) => {
        if (err) throw err;

        return res.json({
            success: true,
            users: users
        });
    })
});

router.get('/:id', function (req, res) {

    var id = req.params.id;

    if (!id) {
        return res.json({
            success: false,
            error: [{
                msg: 'O id é obrigatório.'
            }]
        })
    }

    User.getUserById(id, (err, user) => {
        if (err) throw err;

        return res.json({
            success: true,
            user: user
        });
    })
});

router.post('/approve', function (req, res) {
    console.log('approve')
    console.log(req.body)

    var _id = req.param('userId');
    var approved = req.param('approved');

    req.checkBody('_id', 'O _id é obrigatório').notEmpty();
    req.checkBody('approved', 'A situação é obrigatória').notEmpty();

    var errors = req.validationErrors();

    if (req.validationErrors()) {
        return res.send({
            success: false,
            error: errors
        });
    }

    User.approve(_id, approved, function (err, user) {
        if (err) throw err;
        console.log(user);
        return res.json({
            success: true,
            message: 'Usuário aprovado com sucesso'
        });
    });

    // User.getUserById(_id, (err, user) => {
    //         if (err) throw err;


    //     }
    // );
});

module.exports = router;