const mongoose = require('mongoose');
var dbs = require('../config/db');

const DonationSchema = new mongoose.Schema({

    itemName: {
        type: String,
        require: true
    },
    description: {
        type: String,
        required: true
    },
    capacity: {
        type: String,
        required: true
    },
    donor: {
        type: String,
        require: true
    },
    requestList: {
        type: Array,
        default: []
    },
    status:{
        type: String,
        default: "notDone"
    }
});





// Donation.prototype.changeCapacity = function(newCapacity){

//     Array.prototype.forEach.call(this.requestList, request=>{
//         request.update(newCapacity)
//     })
// }

var Donation = dbs.normalDB.model('Donation', DonationSchema)
var APIDonation = dbs.apiTestDB.model('Donation', DonationSchema)


module.exports = {
    Donation: Donation,
    APIDonation: APIDonation
}