const StatusHistory = require('../models/StatusHistory');

class StatusHistoryDAO{

    constructor(mode){
        this.db = StatusHistory.StatusHistory;
        if(mode == "test"){
            this.db = StatusHistory.APIStatusHistory;
        }
    }

    async create(username, time, fromStatus, toStatus){
        return await this.db.create(
            username,
            time,
            fromStatus,
            toStatus);
    }

    async findStatusHistory(username){
        return this.db.findStatusHistory(username);
    }

    async changeUsername(username, formerUsername){
        return this.db.updateMany({username: formerUsername}, {$set: {username: username}})
    }

}

module.exports = StatusHistoryDAO;
