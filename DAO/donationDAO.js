const { connect } = require('mongoose');
const Donation = require('../models/Donation');

class DonationDAO{

    constructor(mode){
        this.db = Donation.Donation;

        if (mode =="api"){
            this.db = Donation.APIDonation;
        }    
    }


    async create(itemName, description, capacity, donor){
        return await this.db.create({
            itemName: itemName,
            description: description,
            capacity: capacity,
            donor: donor
        })
    }

    async findOneByID(id){
        return await this.db.findOne({_id:id})
    }

    async getAll(){
        return await this.db.find({})
    }

    //remove new request to donation
    async removeRequest(donationID, requestID){
        var cur = await this.db.findOne({_id: donationID})
        if(cur == null) return
        var list = cur.requestList
        const index = list.indexOf(requestID)
        // console.log("before : "+list)
        if(index > -1){
            list.splice(index,1)
        }
        // console.log("after : "+list)
        var updatedCur = await this.db.updateOne({_id: donationID},{requestList: list})
        return updatedCur
    }

    //add new request to donation
    async addRequest(donationID, requestID){
        var cur = await this.db.findOne({_id: donationID})
        var list = cur.requestList
        list.push(requestID)
        var updatedCur = await this.db.updateOne({_id: donationID},{requestList: list})
        return updatedCur
    }

    async getUnhandledDonationByDonor(donor){
        return await this.db.find({'donor':donor,requestList:{$exists:true,$type:'array',$ne:[]}})
    }

    async updateCapacity(donationID, capacity){
        return await this.db.updateOne({_id: donationID},{capacity: capacity})
    }

    async updateStatus(donationID, status){
        return await this.db.updateOne({_id: donationID},{status: status})
    }

    async removeDonation(donationID){
        return await this.db.remove({_id: donationID})
    }

    async getAllMyDonation(donor){
        return await this.db.find({donor: donor})
    }


    async changeUsername(username, formerUsername){
        return this.db.updateMany({donor: formerUsername}, {$set: {donor: username}})
    }



}

module.exports = DonationDAO;