var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var moment = require('moment')

var TransitSchema = mongoose.Schema({
    userId: {
        type: String,
        index: true
    },
    img: {
        type: String
    },
    automaticBarrierId: {
        type: Number
    },
    automaticBarrierLocatioName: {
        type: String
    },
    date: {
        type: Date
    },
});

var Transit = module.exports = mongoose.model('Transit', TransitSchema);

module.exports.create = function (newTransit, callback) {
    newTransit.save(callback);
};

module.exports.getByUserId = function (userId, callback) {
    var query = {
        userId: userId,
    };
    Transit.find(query, callback);
}

module.exports.getCountByToday = function (userId, callback) {
    var today = moment().startOf('day')
    var tomorrow = moment(today).add(1, 'days')

    var query = {
        userId: userId,
        date: {
            $gte: today,
            $lt: tomorrow
        }
    };
    Transit.count(query, callback);
}

module.exports.todayCountByBarrier = function (callback) {

    var query = [{
        "$match": {
            "date": {
                "$lt": new Date(),
                "$gte": new Date(new Date().setDate(new Date().getDate() - 1))
            }
        },
    }, {
        "$group": {
            _id: "$automaticBarrierId",
            count: {
                "$sum": 1
            }
        }
    }];

    Transit.aggregate(query, callback);
}

module.exports.getAllByToday = function (callback) {
    var query = [{
        "$match": {
            "date": {
                "$lt": new Date(),
                "$gte": new Date(new Date().setDate(new Date().getDate() - 1))
            }
        },
    }, {
        "$group": {
            "_id": {
                "year": {
                    "$year": "$date"
                },
                "dayOfYear": {
                    "$dayOfYear": "$date"
                },
                "hour": {
                    "$hour": "$date"
                },
                "interval": {
                    "$subtract": [{
                        "$minute": "$date"
                    }, {
                        "$mod": [{
                            "$minute": "$date"
                        }, 15]
                    }]
                }
            },
            "count": {
                "$sum": 1
            }
        }
    }];

    Transit.aggregate(query, callback);
}