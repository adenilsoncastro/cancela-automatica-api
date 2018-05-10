var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var CarSchema = mongoose.Schema({
    userId: {
        type: String,
    },
    modelo: {
        type: String,
    },
    marca: {
        type: String
    },
    placa: {
        type: String
    }
});

var Car = module.exports = mongoose.model('Car', CarSchema);

module.exports.createCar = function (newCar, callback) {
    newCar.save(callback);
};

module.exports.getByUserId = function (userIdQuery, callback) {
    var query = {
        userId = userIdQuery
    };
    User.findOne(query, callback);
}

module.exports.getByPlate = function (plateQuery, callback) {
    var query = {
        plate: plateQuery
    };
    User.findOne(query, callback);
}