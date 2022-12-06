console.log("userdao");
const { isRedirect } = require('node-fetch');
const User = require('../models/User');
const UserDBs = require('../models/User');
class UserDAO{

    constructor(mode){
        this.mode = mode;

        this.db = UserDBs.User;
        
        if (mode == "measure"){
            this.db = UserDBs.MeasurePerformanceUser;

        }
        else if (mode =="api"){
            this.db = UserDBs.APIUser;
        }
      
    }


    async create(username, password){ 
        return await this.db.create({
            username:username,
            password: password,
            online: true,
            status: "undefined",
            statusUpdateTime: new Date(),
            socketID: "undefined"
        })
    }

    async changeStatus(usernamedata, newStatusdata, timestampdata){
        return await this.db.updateOne({username:usernamedata},{status:newStatusdata, statusUpdateTime: timestampdata});
    }

    async getAllUsers(){
        return await this.db.getAllUsers();
    }

    async getAllActiveUsers(){
        return await this.db.getAllActiveUsers();
    }

    async updateOnlineStatus(usernamedata, onlinedata){
        return await this.db.updateOne({username: usernamedata},{online: onlinedata})
    }

    async findUser(username){
       
        return this.db.findOne({username: username});
    }

    async findAllUsers(pattern, status){ 
        var res = this.db.find({});
        console.log(pattern, status);
        if(pattern) {
          res = this.db.find({username: {$regex: pattern}});
        }
        if(status){
          res = res.find({status: status});
        }
        return res.sort({online: -1, username: 1});

       
    }

    async getUser(username){
        return this.db.find({username: username});
    }
    
    async setSocketID(username, socketID){
        return await this.db.setSocketID(username, socketID)
    }

    async getSocketID(username){
        return await this.db.getSocketID(username)

    }

    async editContact(username, contact1, contact2, contact3){
        return this.db.updateOne({username: username}, {emergencyContacts: [contact1, contact2,contact3]});
    }


    async changeProfileWithPassword(formerUsername, username, password, privilege, accountStatus){
        console.log("changeProfileWithPassword fun"+password)
        return await this.db.updateMany({username: formerUsername}, {$set: {username:username, password: password, privilege: privilege, accountStatus: accountStatus}})
    }

    async changeProfileWithoutPassword(formerUsername, username, privilege, accountStatus){
        console.log("changeProfileWithoutPassword fun")
        return await this.db.updateMany({username: formerUsername}, {$set: {username:username,  privilege: privilege, accountStatus: accountStatus}})
    }

    async getShelter(username){
        return this.db.find({username: username}, {shelter: 1});
    }

    async joinShelter(username, shelterAddress){
        return this.db.updateOne({username: username}, {$set: {shelter: shelterAddress}});
    }

    async leaveShelter(username){
        return this.db.updateOne({username: username}, {$set: {shelter: ""}});
    }

    async deleteShelter(address){
        return this.db.updateMany({address: address}, {$set: {shelter: ""}})
    }

}

module.exports = UserDAO;

