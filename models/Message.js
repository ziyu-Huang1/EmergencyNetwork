const mongoose = require('mongoose');
var dbs = require('../config/db');

const MessageSchema = new mongoose.Schema({
    content: {
        type: String,
        require: true
    },
    sender: {
        type: String,
        required: true
    },
    receiver: {
        type: String
    },
    // message type: public/private
    type: {
        type: String,
        require: true
    },
    time: {
        type: Date,
        default: Date.now
    },
    // user status
    senderStatus: {
        type: String
    },
    // message have been read or not
    ifread:{
        type: Boolean,
        default: false
    }
});



MessageSchema.statics.getUnreadList = (receiver) =>{
    return Message.find({type: "private", receiver: receiver, ifread: false}, {sender: 1}).distinct('sender');
}

MessageSchema.statics.updateIfRead = (sender, receiver) => {
    return Message.updateMany({sender: receiver, receiver: sender}, {$set: {ifread: true}});
}


MessageSchema.statics.findMessages = (cont, limit, sender, receiver) => {
    limit = limit? Number(limit): 10;
    var res = Message.find({content: {$regex: cont}}).sort({time: -1});
    if(receiver && sender){
        res = res.find({$or:[{receiver: sender, sender: receiver},{receiver: receiver, sender: sender}]}).sort({time: -1});
    }
    return res;
}

var Message = dbs.normalDB.model('Message', MessageSchema);

var MeasurePerformanceMessage = dbs.testDB.model('Message', MessageSchema);
var APIMessage = dbs.apiTestDB.model('Message', MessageSchema);

module.exports = {
    Message: Message,
    MeasurePerformanceMessage: MeasurePerformanceMessage,
    APIMessage: APIMessage

};