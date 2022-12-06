const { connect } = require('mongoose');
const contactDB = require('../models/EmergencyContatcs');
const { use } = require('../routes');
class EmergenncyContactDAO{

    constructor(mode){
        this.mode = mode;
        this.db = contactDB.EmergencyContacts;
        
        if (mode =="api"){
            this.db = contactDB.APImergencyContacts;
        }
    }


    async findContacts(username){ 
        return await this.db.findOne({username:username});
    }

    async createContact(username, contact1, contact2, contact3){ 
        if (contact1 == "undefined" && contact2  == "undefined" &&  contact3 == "undefined"){
            return {username: username,
                contact1: contact1,
                contact2: contact2,
                contact3: contact3}
        }
        return await this.db.create({
            username: username,
            contact1: contact1,
            contact2: contact2,
            contact3: contact3
        })
    }


    async editContact(username, contact1, contact2, contact3){
        return this.db.updateOne({username: username}, {contact1:contact1, contact2: contact2,contact3: contact3});
    }


    async changeUsername(username, formerUsername){
        this.db.updateMany({username: formerUsername}, {$set: {username: username}})
        this.db.updateMany({contact1: formerUsername}, {$set: {contact1: username}})
        this.db.updateMany({contact2: formerUsername}, {$set: {contact2: username}})
        this.db.updateMany({contact3: formerUsername}, {$set: {contact3: username}})
    }

}



module.exports = EmergenncyContactDAO;

