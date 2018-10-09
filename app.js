var express = require('express');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var cors = require('cors')
const jwt = require('jsonwebtoken');

mongoose.connect('mongodb://localhost/loginapp');
var db = mongoose.connection;

var users = require('./routes/users-controller');
var plates = require('./routes/plates-controller');
var transits = require('./routes/transits-controller');
var qrcode = require('./routes/qrcode-controller');
var notification = require('./routes/notification-controller');
var index = require('./routes/index-controller');

var app = express();

app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(expressValidator({
  errorFormatter: function (param, msg, value) {
    var namespace = param.split('.'),
      root = namespace.shift(),
      formParam = root;

    while (namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param: formParam,
      msg: msg,
      value: value
    };
  }
}));

app.use('/users', users);
app.use('/plates', plates);
app.use('/transits', transits);
app.use('/qrcode', qrcode);
app.use('/notification', notification);
app.use('/', index);

app.set('port', (process.env.PORT || 8080));

app.listen(app.get('port'), function () {
  console.log('Server started on port ' + app.get('port'));
});