const { connect } = require('mongoose');
const Announcement = require('../models/Announcement');

class AnnouncementDAO{


    constructor(mode){
        this.db = Announcement.Announcement;
         
        if (mode =="api"){
            
             this.db = Announcement.APIAnnouncement;
         }        
     }  
      
    async create(content, sender, time){
        return await this.db.create({
            content: content,
            sender: sender,
            time: time
        }
           
        );
    }

    async getLatest(){

        return this.db.find({}).sort({time: -1}).limit(1);
    }

    async getAll(){
        return this.db.find({});
    }
    
    async findAnnouncement(content, limit){
        if(content){
            return this.db.find({content: {$regex: content}}).sort({time: -1});
        }
        return null;
    }

    async changeUsername(username, formerUsername){
        return this.db.updateMany({sender: formerUsername}, {$set: {sender: username}})
   }

}

module.exports = AnnouncementDAO;