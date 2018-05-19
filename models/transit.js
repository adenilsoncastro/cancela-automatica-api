var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var TransitSchema = mongoose.Schema({
    userId: {
        type: String,
        index: true
    },
    automaticBarrierId: {
        type: Date
    },
    date: {
        type: Date
    },
});

var Transit = module.exports = mongoose.model('Transit', TransitSchema);

module.exports.create = function (newTransit, callback) {
    newTransit.save(callback);
};

module.exports.geByUserId = function (userId, callback) {
    var query = {
        userId: userId,
    };
    Transit.find(query, callback);
}