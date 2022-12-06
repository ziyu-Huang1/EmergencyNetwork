var express = require('express');

var router = express.Router();

const public_wall_controller = require("../controller/publicWallController.js");

router.get('/', public_wall_controller.publicWall_get);
router.get('/alarmList', public_wall_controller.publicWall_alarmList_get);
router.post('/', public_wall_controller.publicWall_post);
//router.put('/socketUpdate', public_wall_controller.socketUpdate);
router.put('/socketUpdate',public_wall_controller.socketUpdate)


module.exports = router;