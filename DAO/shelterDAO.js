const Shelter = require('../models/Shelter');

class ShelterDAO{

    constructor(mode) {
        if (mode == 'api'){
            this.db = Shelter.APIShelter;
        }
        else {
            this.db = Shelter.Shelter;
        }
    }

    async create(data){
        var ifFood = false;
        var ifMedicine = false;

        if (data.foodProvided.toLowerCase() == 'true'){
            ifFood = true;
        }

        if (data.medicineProvided.toLowerCase() == 'true'){
            ifMedicine = true;
        }

        return await this.db.create({
            address: data.address,
            maxCapacity: Number(data.maxCapacity),
            curCapacity: 0,
            foodProvided: data.ifFood,
            medicineProvided: data.ifMedicine,
            creator: data.creator
        });
    }

    async getAll(){
        return this.db.find({});
    }

    async joinShelter(address, cur){
        return this.db.updateOne({address: address}, {$set: {curCapacity: cur}})
    }

    async leaveShelter(address, cur){
        return this.db.updateOne({address: address}, {$set: {curCapacity: cur}})
    }

    async deleteShelter(address){
        return this.db.deleteOne({address: address});
    }

    async checkCapacity(address){
        return this.db.find({address: address}, {curCapacity: 1, maxCapacity: 1})
    }

    async changeUsername(username, formerUsername){
        return this.db.updateMany({creator: formerUsername}, {$set: {creator: username}})
    }
}

module.exports = ShelterDAO;