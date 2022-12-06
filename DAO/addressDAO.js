const AddressDBs = require('../models/Address');
const DeliveryRequestDBs = require('../models/DeliveryRequest');

class AddressDAO{
    constructor(mode){
        this.db = AddressDBs.Address;
        if(mode == "api"){
            this.db = AddressDBs.APIAddress;
        }
    }

    async checkDb(){
        return this.db != null;
    }

    async create(username, address, x, y){
        return await this.db.create({
            username: username,
            address: address,
            x:x,
            y:y
        });
    }

    async updateUserAddress(username, address, x, y){
        return await this.db.updateMany({username: username}, {$set: {address: address, x: x, y: y}});
   }

   async getUserAddress(username){
        return await this.db.find({username: username});
   }

   async deleteAddress(username){
        return await this.db.deleteMany({username: username});
   }

   async changeUsername(username, formerUsername){
        return this.db.updateMany({username: formerUsername}, {$set: {username: username}})
   }

}

module.exports = AddressDAO;
