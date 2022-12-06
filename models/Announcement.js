const mongoose = require('mongoose');
var dbs = require('../config/db');

const AnnouncementSchema = new mongoose.Schema({
    content: {
        type: String,
        require: true
    },
    sender: {
        type: String,
        required: true
    },
    time: {
        type: Date,
        default: Date.now
    }
});

var Announcement = dbs.normalDB.model('Announcement', AnnouncementSchema);
var APIAnnouncement = dbs.apiTestDB.model('Announcement', AnnouncementSchema);

module.exports = {Announcement: Announcement, APIAnnouncement: APIAnnouncement};