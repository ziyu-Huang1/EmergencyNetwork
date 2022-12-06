const mongoose = require('mongoose');
var dbs = require('../config/db');

const ShelterSchema = new mongoose.Schema({
    address: {
        type: String,
        require: true
    },
    maxCapacity: {
        type: Number,
        require: true
    },
    curCapacity: {
        type: Number,
        require: true
    },
    foodProvided: {
        type: Boolean,
        require: true
    },
    medicineProvided: {
        type: Boolean,
        require: true
    },
    creator: {
        type: String,
        require: true
    }

});

var Shelter = dbs.normalDB.model('Shelter', ShelterSchema);

var APIShelter = dbs.apiTestDB.model('Shelter', ShelterSchema);

module.exports = {
    Shelter: Shelter,
    APIShelter: APIShelter
};