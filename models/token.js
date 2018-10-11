var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var TokenSchema = mongoose.Schema({
    token: {
        type: String
    },
    userId: {
        type: String
    }
});

var Token = module.exports = mongoose.model('Token', TokenSchema);

module.exports.getTokenByUserId = function (userId, callback) {
    var query = {
        userId: userId
    };
    console.log('query: ')
    console.log(query)
    Token.findOne(query, callback);
}