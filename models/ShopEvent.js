const mongoose = require('mongoose');
var dbs = require('../config/db');

const ShopEventSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    max: {
        type: Number,
        require: true
    },
    min: {
        type: Number, 
        default: 0,
        require: true
    },
    initiator: {
        type: String,
        require: true
    },
    member: {
        type: Array,
        require: true
    },
    status:{
        type: String,
        require: true
    }
});

ShopEventSchema.statics.create = (title, description, max, min, initiator, member,status) =>{
    let newEvent = new ShopEvent({
        title: title,
        description: description,
        max: max,
        min: min,
        initiator:initiator,
        member: member,
        status: status
    });

    let res = newEvent.save();
    return res;
}

// ShopEventSchema.static.addMember = (title, newMember) =>{
//     ShopEventSchema.
// }

// ShopEventSchema.statics.findShopEvent = (title) =>{
//     return ShopEvent.find({title: title}).sort({time: -1});
// }

var ShopEvent = dbs.normalDB.model('ShopEvent', ShopEventSchema);

module.exports = {
    ShopEvent: ShopEvent
};