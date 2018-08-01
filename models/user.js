var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var UserSchema = mongoose.Schema({
    // _id: {
    //     type: String
    // },
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
    },
    approved: {
        type: Boolean
    }
});

var User = module.exports = mongoose.model('User', UserSchema);

module.exports.createUser = function (newUser, callback) {
    console.log(newUser)
    newUser.save(callback);
};

module.exports.updateUser = function (user, id, callback) {
    console.log(user)
    User.update({
        _id: mongoose.Types.ObjectId(id)
    }, user, {
        upsert: false
    }, callback);
};

module.exports.approve = function (id, approved, callback) {

    User.findOneAndUpdate({
            _id: mongoose.Types.ObjectId(id),
        }, {
            $set: {
                'approved': approved
            }
        }, {
            upsert: false
        },
        callback);
}

module.exports.getUserByUsernameAndPassword = function (username, password, usertype, callback) {
    var query = {
        username: username,
        password: password,
        usertype: usertype
    };
    console.log('query: ')
    console.log(query)
    User.findOne(query, callback);
}

module.exports.getUnapproved = function (callback) {
    User.find({
        approved: false
    }, callback);
}

module.exports.getApproved = function (callback) {
    User.find({
        approved: true
    }, callback);
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

module.exports.getUserByIdAndPlate = function (id, platenumber, callback) {
    var query = {
        _id: id,
        placa: platenumber
    };
    console.log(query)
    User.findOne(query, callback);
}

module.exports.getUserById = function (id, callback) {
    User.findById(id, callback);
}