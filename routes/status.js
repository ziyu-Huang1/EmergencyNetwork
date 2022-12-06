var express = require('express');
var router = express.Router();
const path = require('path');
const config = require('config');
const shareStatusController = require("../controller/shareStatusController.js");

/* POST change status*/
router.post('/', shareStatusController.changeStatus);

/* GET ready to select status */
router.get('/:name', function(req, res, next) {
    res.sendFile(path.join(__dirname,'..','views','shareStatusPage.html'));
})


module.exports = router;