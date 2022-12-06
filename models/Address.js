const mongoose = require('mongoose');
var dbs = require('../config/db');

const AddressSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
      },
    address:{
        type: String
    },
    x:{
        type: String
    },
    y:{
        type:String
    }
});

var Address = dbs.normalDB.model('Address', AddressSchema);
var apiAddress = dbs.apiTestDB.model('Address', AddressSchema);

module.exports = {
    Address: Address,
    APIAddress: apiAddress
};