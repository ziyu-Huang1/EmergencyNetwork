var express = require('express');
var router = express.Router();
const post_announcement_controller = require('../controller/postAnnouncementController.js')

router.get('/all', post_announcement_controller.postAnnouncement_getAll);
router.get('/single', post_announcement_controller.postAnnouncement_getOne);
router.post('/', post_announcement_controller.postAnnouncement_post);
// router.get('/announcementWall', post_announcement_controller.postAnnouncement_showAll)
module.exports = router;