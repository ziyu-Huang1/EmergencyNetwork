const { connect } = require('mongoose');
const DonationRequest = require('../models/DonationRequest');
const Donation = require('../models/Donation');

class DonationRequestDAO{

    constructor(mode){
        this.db = DonationRequest.DonationRequest;

        if (mode =="api"){
            this.db = DonationRequest.APIDonationRequest;
        }    
    }

    async create(bag, bag1, reason,  donationID){
        return await this.db.create({
            itemName: bag.itemName_v,
            capacity: bag.capacity_v,
            donor: bag.donor_v,
            donee: bag1.donee_v,
            reason: reason,
            requestNum: bag1.requestNum_v,
            donationID: donationID
        })
    }


    async deleteMany(){
        return await this.db.deleteMany({})
    }

    async getAllMyRequest(donee){
        return await this.db.find({donee: donee}).sort({unread:1})
    }

    async getAllOtherRequestByID(donationID){
        return await this.db.find({donationID: donationID}).sort({status:1})
    }

    async getOneOtherRequest(id){
        return await this.db.find({_id: id})
    }

    async updateOneOtherRequestStatus(id,status){
        var ori_cur = await this.db.findOne({_id: id})
        var ori_status = ori_cur.status
        if(ori_status == "pending"){
            return await this.db.updateOne({_id: id},{status: status})
        }else{
            return await this.db.updateOne({_id: id},{status: ori_status})
        }
        
    }

    async findOneByID(id){
        return await this.db.findOne({_id:id})
    }

    async updateCapacity(id, capacity){
        var updateResult
        // try{
            updateResult = await this.db.updateOne({_id: id},{capacity: capacity})
            
        // }catch(error){
        //     console.log(error+ " error "+capacity)
        // }
        return updateResult
        
    }

    async getUnreadReply(donee){
        return await this.db.find({'donee':donee,'unread':"true"})
    }

    async updateReadStatus(requestID, unread){
        return await this.db.updateOne({_id: requestID}, {unread: unread})
    }

    async changeDonorUsername(username, formerUsername){
        return this.db.updateMany({donor: formerUsername}, {$set: {donor: username}})
    }
    async changeDoneeUsername(username, formerUsername){
        return this.db.updateMany({donee: formerUsername}, {$set: {donee: username}})
    }


}

module.exports = DonationRequestDAO;