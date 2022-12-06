var express = require('express');
var router = express.Router();
const path = require('path');
// const config = require('config');
var searchInfoController = require('../controller/searchInfoController.js');
// const JwtUtil = require('../config/JWTController');
// const { route } = require('./index.js');
/* GET login */

router.get('/users', searchInfoController.userInfo);

router.get('/announcement', searchInfoController.announcementInfo);


router.get('/messages/public', searchInfoController.publicMessageInfo);

router.get('/messages/private', searchInfoController.privateMessageInfo);

router.get('/show/:type', function(req, res, next) {
    res.sendFile(path.join(__dirname,'..','views','showSearchResult.html'));
})

module.exports = router;