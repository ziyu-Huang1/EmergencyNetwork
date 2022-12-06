var express = require('express');
var router = express.Router();
const path = require('path');
const provide_donation_controller = require("../controller/provideDonationController.js");
//const provide_donation_controller = require("../controller/provideDonationController.js");
const donation_request_controller = require("../controller/donationRequestController.js");



router.post('/', provide_donation_controller.postDonation);

router.get('/:username', function(req,res,next){
    res.sendFile(path.join(__dirname,'..','views','donation.html'));
});

router.get('/', provide_donation_controller.getDonations)

router.post('/request',donation_request_controller.postDonationRequest)

router.put('/myRequests',donation_request_controller.getMyDonationRequest)

router.put('/otherRequests',donation_request_controller.getOtherDonationRequest)

router.put('/otherRequest/detail',donation_request_controller.getOneOtherDonationRequestDetail)

router.put('/otherRequest/update',donation_request_controller.updateOneRequestStatus)

router.put('/addRequest', provide_donation_controller.registerRequest)

router.put('/capacity', provide_donation_controller.notifyRequestCapacity)

router.put('/status', provide_donation_controller.notifyRequestStatus)

router.put('/myDonations', provide_donation_controller.getAllMyDonation)

router.get('/otherRequest/pendingList', provide_donation_controller.getUnhandledDonationRequest)

router.put('/unreadReplyList', donation_request_controller.getUnreadReply)

router.put('/myRequests/unread', donation_request_controller.updateRequestUnread)

router.put('/removeDonation', provide_donation_controller.removeOneDonation)


module.exports = router;