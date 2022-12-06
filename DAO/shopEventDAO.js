const ShopEvent = require('../models/ShopEvent');

class shopEventDAO{

    constructor(){
        this.db = ShopEvent.ShopEvent;
    }

    async create(title, description, max, min, initiator, member, status){

        // return await this.db.deleteMany({})
        return await this.db.create(
            title,
            description,
            max,
            min,
            initiator,
            member,
            status);
    }

    async addMember(title, newMember){
        return await this.db.findOneAndUpdate({title: title}, {
            $push: {member: newMember}
        });
    }

    async updateStatus(title, newStatus){
        return await this.db.findOneAndUpdate({title: title}, {
            status: newStatus
        });
    }

    async getAll(){
        return await this.db.find({status: "in-progress"})
    }

    async getByTitle(title){
        return await this.db.find({title: title})
    }


    async getByInitiator(initiator){
        return await this.db.find({initiator: initiator})
    }

    async getByMember(member){
        return await this.db.find({
            member: member
        })
    }

    async removeEvent(title){
        return await this.db.deleteOne({title: title})
    }

    async changeUsername(username, formerUsername){
        this.db.updateMany({initiator: formerUsername}, {$set: {initiator: username}})
        this.db.updateMany({member: formerUsername}, {$set: {"member.$": username}})
    }

   
}

module.exports = shopEventDAO;
