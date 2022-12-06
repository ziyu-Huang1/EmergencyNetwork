const DeliveryRequest = require('../models/DeliveryRequest');
const DeliveryRequestDBs = require('../models/DeliveryRequest');

class DeliveryRequestDAO{

    constructor(mode){
        this.db = DeliveryRequestDBs.DeliveryRequest;
        if (mode =="api"){
            this.db = DeliveryRequestDBs.APIDeliveryRequest;
        }      
    }    

    async checkDb(){
        return this.db != null;
    }
    
    async create(description, sender, volunteer, time, status, postion, address, contact, x, y){
        return await this.db.create({
            description: description, 
            sender: sender,
            volunteer: volunteer,
            status: status,
            time: time,
            postion: postion,
            address: address,
            contact: contact,
            x: x,
            y: y
        });
    }

    async delete(id){
        return await this.db.deleteMany({_id: id});
    }

    async getUserRequestList(username){
        return await this.db.find({sender: username}).sort({time: -1});
    }

    async getVolunteerRequestList(username){
        return await this.db.find({volunteer: username}).sort({time: -1});
    }
 
    async getPendingRequests(){
        return await this.db.find({status: "pending"}).sort({time: -1});
    }

    async updateRequestStatus(id, status){
         return await this.db.updateMany({_id: id}, {$set: {status: status}});
    }

    async assignVolunteerToRequest(id, username){
        return await this.db.updateMany({_id: id}, {$set: {volunteer: username, status: "in process"}});
    }

    async getRequestsFromId(id){
        return await this.db.find({_id: id});
    }

    async changeSenderUsername(username, formerUsername){
        return this.db.updateMany({sender: formerUsername}, {$set: {sender: username}})
    }

    async changeVolunteerUsername(username, formerUsername){
        return this.db.updateMany({volunteer: formerUsername}, {$set: {volunteer: username}})
    }


}

module.exports = DeliveryRequestDAO;
