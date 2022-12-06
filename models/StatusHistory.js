const mongoose = require('mongoose');
var dbs = require('../config/db');

const StatusSchema = new mongoose.Schema({
    username: {
        type: String,
        require: true
    },
    time: {
        type: Date,
        default: Date.now,
        require: true
    },
    fromStatus: {
        type: String, 
        require: true
    },
    toStatus: {
        type: String,
        require: true
    }
});

StatusSchema.statics.create = (username, time, fromStatus, toStatus) =>{
    let newHistory = new StatusHistory({
        username: username,
        time: time,
        fromStatus: fromStatus,
        toStatus: toStatus
    });

    let res = newHistory.save();
    return res;
}

StatusSchema.statics.findStatusHistory = (username) =>{
    return StatusHistory.find({username: username}).sort({time: -1});
}

var StatusHistory = dbs.normalDB.model('StatusHistory', StatusSchema);
var APIStatusHistory = dbs.apiTestDB.model('StatusHistory', StatusSchema);

module.exports = {
    StatusHistory: StatusHistory,
    APIStatusHistory: APIStatusHistory
};