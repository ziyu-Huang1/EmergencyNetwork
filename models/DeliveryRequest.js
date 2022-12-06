const mongoose = require('mongoose');
var dbs = require('../config/db');

const DeliveryRequestSchema = new mongoose.Schema({
    description:{
        type: String
    },
    sender:{
        type: String,
        require: true
    },
    volunteer:{
        type: String
    },
    status:{
        type: String
    },
    time:{
      type: Date,
      default: Date.now  
    },
    position: {
        type: String
    },
    address:{
        type: String
    },
    contact:{
        type: String
    }
    ,
    x:{
        type: String
    },
    y:{
        type:String
    }
});

var DeliveryRequest = dbs.normalDB.model('DeliveryRequest', DeliveryRequestSchema);
var apiDeliveryRequest = dbs.apiTestDB.model('DeliveryRequest', DeliveryRequestSchema);

module.exports = {
    DeliveryRequest: DeliveryRequest,
    APIDeliveryRequest: apiDeliveryRequest
};