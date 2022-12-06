// const Announcement = require('../models/Announcement');
const AnnouncementDAO = require('../DAO/announcementDAO');
const Announcement = require('../models/Announcement');
const url = require("url");
const { APIAnnouncement } = require('../models/Announcement');

class PostAnnouncementController{
    async postAnnouncement_getAll(req, res){
        console.log("postAnnouncement_get");
        var info = url.parse(req.url, true).query;
        let announcementDAO
            = new AnnouncementDAO("normal");
        
        if (info.testing == "true"){
            announcementDAO = new AnnouncementDAO("api");
        }

        announcementDAO.getAll().then((result)=>{
            console.log(result.length, 'printing announcement length');
            res.status(201).json({ret: result});
        })
    }
    async postAnnouncement_getOne(req, res){
        console.log("postAnnouncement_getOne");
        var info = url.parse(req.url, true).query;
        let announcementDAO
            = new AnnouncementDAO('normal');
        if (info.testing == "true"){
            announcementDAO = new AnnouncementDAO("api");
        }


        announcementDAO.getLatest().then((result)=>{
            res.status(201).json({ret: result});
        })
    }

    async postAnnouncement_post(req, res){
        let announcementDAO
            = new AnnouncementDAO('normal');
        if (req.body.testing == "true"){
            
            announcementDAO = new AnnouncementDAO("api");
            // return res.status(201);
        }
       
        announcementDAO.create(
            req.body.content,
            req.body.sender,
            req.body.time
            ).then((result)=>{
            res.status(201).json({ret: result});
        })
    }


}

let post_announcement_controller = new PostAnnouncementController();

module.exports = {
    postAnnouncement_getAll: post_announcement_controller.postAnnouncement_getAll,
    postAnnouncement_post: post_announcement_controller.postAnnouncement_post,
    postAnnouncement_getOne : post_announcement_controller.postAnnouncement_getOne
    // postAnnouncement_showAll: post_announcement_controller.postAnnouncement_showAll

}