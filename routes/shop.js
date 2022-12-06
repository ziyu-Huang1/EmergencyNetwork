var express = require('express');
var router = express.Router();
const shopController = require('../controller/shopController.js');

/* POST change status*/
router.post('/', shopController.shopAddEvent);
router.post('/member', shopController.shopAddMember);
router.post('/status', shopController.shopUpdateStatus);
router.delete('/title', shopController.shopRemoveEvent);
router.get('/', shopController.shopGetAll);
router.get('/title', shopController.shopGetByTitle);
router.get('/member', shopController.shopGetByMember);
router.get('/initiator', shopController.shopGetByInitiator);
/* GET ready to select status */
// router.get('/:name', function(req, res, next) {
//     res.sendFile(path.join(__dirname,'..','views','shareStatusPage.html'));
// })


module.exports = router;