const MessageDBs = require('../models/Message');
// const TestDB = require()

class MessageDAO{

    constructor(mode){

        if (mode == "measure"){
            this.db = MessageDBs.MeasurePerformanceMessage;    
        }
        else if (mode =="api"){
            this.db = MessageDBs.APIMessage;
        }
        else{
            this.db = MessageDBs.Message;
        }
    }    


    async create(content, sender, receiver, type, time, senderStatus, ifread){
        console.log("post private msg 2 . ");
        return await this.db.create({
            content: content,
            sender: sender,
            receiver: receiver,
            type: type,
            time: time,
            senderStatus: senderStatus,
            ifread: ifread});
       
    }

    async loadPublicMessage(){
        return await this.db.find({type: "public"}).sort({ $natural: -1}).limit(10);
    }

    async getUnreadList(receiver){
         return await this.db.find({type: "private", receiver: receiver, ifread: false}, {sender: 1}).distinct('sender');
    }


    async loadPrivateMessage(user1, user2){
        return await this.db.find({type: "private", $or: [{sender: user1, receiver: user2}, {sender: user2, receiver: user1}]});
    }

    async remove(){
        await MessageDBs.MeasurePerformanceMessage.remove()
    }

    async updateIfRead(sender, receiver){
         return await this.db.updateIfRead(sender, receiver);
    }

    async findMessages(cont, limit, sender, receiver){
        return await this.db.findMessages(cont, limit, sender, receiver);
    }

    async changeSenderUsername(username, formerUsername){
        return this.db.updateMany({sender: formerUsername}, {$set: {sender: username}})
    }

    async changeReceiverUsername(username, formerUsername){
        return this.db.updateMany({receiver: formerUsername}, {$set: {receiver: username}})
    }
}

module.exports = MessageDAO;
