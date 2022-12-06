const mongoose = require('mongoose');
var dbs = require('../config/db');

const DonationRequestSchema= new mongoose.Schema({
    itemName: {
        type: String,
        require: true
    },
    capacity: {
        type: String,
        required: true
    },
    donor: {
        type: String,
        require: true
    },
    donee: {
        type: String,
        require: true
    },
    reason: {
        type: String,
        require: true 
    },
    requestNum: {
        type: String,
        require: true
    },
    donationID: {
        type: String,
        require: true
    },
    status: {
        type: String,
        default: "pending"
    },
    time: {
        type: Date,
        default: Date.now
    },
    unread:{
        type: String,
        default: "true"
    }
})

var DonationRequest = dbs.normalDB.model('DonationRequest', DonationRequestSchema)
var APIDonationRequest = dbs.apiTestDB.model('DonationRequest', DonationRequestSchema)

module.exports = {
    DonationRequest: DonationRequest,
    APIDonationRequest: APIDonationRequest
}

// function DonationRequest(name,num){
//     console.log("fasdfasd")
//     this.name = name
//     this.num = 3
// }

// DonationRequest.prototype.update= function(newCapacity){
//     this.num = newCapacity
// }


// module.exports = DonationRequest