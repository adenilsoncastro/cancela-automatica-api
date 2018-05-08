var express = require('express');
var router = express.Router();

router.get('/', function (req, res){
    res.send('If you reached here, everything is working fine.');
    var ip = req.connection.remoteAddress;
    console.log('Connection from:' + ip);
});

module.exports = router;