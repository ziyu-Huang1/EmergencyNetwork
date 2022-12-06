var express = require('express')
var router = express.Router();
const request_delivery_controller = require('../controller/requestDeliveryController');
const provide_delivery_controller = require('../controller/provideDeliveryController');
const public_wall_controller = require('../controller/publicWallController');

router.get('/userRequests', request_delivery_controller.getHistoryRequests);

router.post('/userRequests', request_delivery_controller.createNewRequest);

router.delete('/userRequests', request_delivery_controller.cancelPendingRequest);

router.get('/volunteerRequests', provide_delivery_controller.getHistoryRequests);

router.get('/pendingRequests',  provide_delivery_controller.getPendingRequests);

router.post('/requestStatus', provide_delivery_controller.updateRequestStatus);

router.post('/requestVolunteer', provide_delivery_controller.acceptRequests);

router.put('/socketUpdate', public_wall_controller.socketUpdate);

router.get('/userAddress', request_delivery_controller.getUserAddress);

router.post('/userAddress', request_delivery_controller.updateUserAddress);

module.exports = router;