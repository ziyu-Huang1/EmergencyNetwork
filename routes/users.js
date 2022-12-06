var express = require('express');
var router = express.Router();
const path = require('path');
const config = require('config');
var JoinCommunityController = require('../controller/JoinCommunityController.js');
const JwtUtil = require('../config/JWTController');
const { route } = require('./index.js');
/* GET login */


router.get('/public/:name', function(req, res, next) {
    res.sendFile(path.join(__dirname,'..','views','publicChatPage.html'));
});

router.put("/offline", JoinCommunityController.logOut);

router.get("/", JoinCommunityController.getAllUsers);

router.post('/', JoinCommunityController.LoginCommunity);

router.get('/homepage/:name', function(req, res, next) {
    res.sendFile(path.join(__dirname,'..','views','user_profile.html'));
})

router.get('/directory/:username', function(req, res, next) {
    res.sendFile(path.join(__dirname,'..','views','directory.html'));
})

router.get('/shelters/:username', function(req, res, next) {
    res.sendFile(path.join(__dirname,'..','views','shelter.html'));
})

router.get('/announcement/:username', function(req, res, next) {
    res.sendFile(path.join(__dirname,'..','views','announcement.html'));
})

router.get('/profile/:username', function(req, res, next) {
    res.sendFile(path.join(__dirname,'..','views','userProfile.html'));
})

router.get('/measure/:username', function(req, res, next) {
    res.sendFile(path.join(__dirname,'..','views','measure_performance.html'));
})
router.get('/shop/:username', function(req, res, next) {
    res.sendFile(path.join(__dirname,'..','views','shop.html'));
})
router.get('/shop/detail/:username', function(req, res, next) {
    res.sendFile(path.join(__dirname,'..','views','shopJoinDetail.html'));
})
router.get('/shop/event/:username', function(req, res, next) {
    res.sendFile(path.join(__dirname,'..','views','shopPublish.html'));
})
router.get('/shop/cart/:username', function(req, res, next) {
    res.sendFile(path.join(__dirname,'..','views','shopCart.html'));
})

router.get('/deliverys/:username', function(req, res, next){
    res.sendFile(path.join(__dirname,'..','views','foodDelivery.html'));
});

router.get('/donation/:username', function(req, res, next) {
    res.sendFile(path.join(__dirname,'..','views','donation.html'));
})

router.get('/donation/myDonations/:username',function(req, res, next) {
    res.sendFile(path.join(__dirname,'..','views','myDonation.html'));
})

router.get('/donation/addingNewDonation/:username', function(req, res, next) {
    res.sendFile(path.join(__dirname,'..','views','donation_form.html'));
})


router.get('/donationRequest/:itemName', function(req, res, next){
    res.sendFile(path.join(__dirname,'..','views','donationRequest_form.html'));
})

router.get("/donation/myRequest/:username", function(req, res, next){
    res.sendFile(path.join(__dirname,'..','views','myDonationRequest.html'));
})


router.get("/donationRequest/otherRequest/:details", function(req, res, next){
    res.sendFile(path.join(__dirname,'..','views','otherDonationRequestDetail.html'));
})

router.get("/donation/otherRequest/:donationDetails", function(req, res, next){
    res.sendFile(path.join(__dirname,'..','views','otherDonationRequest.html'));
})


router.get('/newDeliverys/:username', function(req, res, next){
    res.sendFile(path.join(__dirname,'..','views','newDeliveryRequest.html'));
});

router.get('/newAddress/:username', function(req, res, next){
    res.sendFile(path.join(__dirname,'..','views','addressInfo.html'));
});

router.get('/adminUserProfile/:username', function(req, res, next){
    res.sendFile(path.join(__dirname,'..','views','adminUserProfile.html'));
});

/*PUT '/login' -- login page*/
/**
 * Try to Login user
 * - check if username is banned: if banned, return 400: bad request 
 * - if username is not banned: find the user from database  and check for password
 *       - (if user not found, return 404 not found)
 *   - if password is correct: generate token -> 200 OK-> login success
 *   - if password is incorrect: 401: unauthorized 
 */
router.put('/', JoinCommunityController.ExistUserLogin);


module.exports = router;