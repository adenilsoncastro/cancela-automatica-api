var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var UserSchema = mongoose.Schema({
    _id: {
        type: String
    },
    username: {
        type: String,
        index: true
    },
    password: {
        type: String
    },
    email: {
        type: String
    },
    // car: [{type: mongoose.Schema.Types.ObjectId, ref: 'Car'}]
    name: {
        type: String
    },
    marca: {
        type: String
    },
    modelo: {
        type: String
    },
    placa: {
        type: String
    },
    usertype: {
        type: Number
    }
});

var User = module.exports = mongoose.model('User', UserSchema);

module.exports.createUser = function (newUser, callback) {
    console.log(newUser)
    newUser.save(callback);
};

module.exports.getUserByUsernameAndPassword = function (username, password, usertype,callback) {
    var query = {
        username: username,
        password: password,
        usertype: usertype
    };
    console.log('query: ')
    console.log(query)
    User.findOne(query, callback);
}

module.exports.getUserByUsername = function (username, callback) {
    var query = {
        username: username
    };
    User.findOne(query, callback);
}

module.exports.getUserByPlate = function (platenumber, callback) {
    var query = {
        placa: platenumber
    };
    console.log(query)
    User.findOne(query, callback);
}

module.exports.getUserById = function (id, callback) {
    User.findById(id, callback);
}