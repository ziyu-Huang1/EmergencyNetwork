
const MessageDAO = require('../DAO/messageDAO')
const UserDAO = require('../DAO/userDAO')

const url = require("url");

class publicWallController{

    async publicWall_get(req, res) {
        let messageDAO ;
        
        if (global.measureMode){
            messageDAO = new MessageDAO("measure")
        }else if (req.body.testing == "true"){
            messageDAO = new MessageDAO("api")
        }else{
            messageDAO = new MessageDAO("normal")
        }
   
        messageDAO.loadPublicMessage().then((result)=>{
            if(global.measureMode) {
                global.measureTool.incrementCntGet();
            }
            res.status(200).json({meglist: result});
        }).catch((err)=>{
            res.status(500).json("server error retriving msg list");
        }) 
    }

    async publicWall_post(req, res) {
        
        let messageDAO ;
        
        if (global.measureMode){
            messageDAO = new MessageDAO("measure")
        }else if (req.body.testing == "true"){
            messageDAO = new MessageDAO("api")
        }else{
            messageDAO = new MessageDAO("normal")
        }
        try {
            var result = messageDAO.create(
                req.body.content,
                req.body.sender,
                req.body.receiver, 
                req.body.type,
                new Date(),
                req.body.status,
                false);

            
            if(global.measureMode) {
                global.measureTool.incrementCntPost();
            }
            res.status(201).json({ret: result});
          }
          catch (e) {
            
            res.status(500).json("server error posting msg");
          }
        
    
    }

    async publicWallAlarmList_get(req, res) {

        var info = url.parse(req.url,true).query;

        let messageDAO ;
        
        if (global.measureMode){
            messageDAO = new MessageDAO("measure")
        }else if (info.testing == "true"){
            messageDAO = new MessageDAO("api")
        }else{
            messageDAO = new MessageDAO("normal")
        }

        messageDAO.getUnreadList(info.username).then((result)=>{
            res.status(200).json({senderlist: result});
        }).catch((err)=>{
            res.status(500).json("server error retrieving public msg list");
        })
    }



    async socketUpdate(req, res){
        var username = req.body.username;
        var socket = req.body.socket;
        let user_map = req.app.get('userMap');
        user_map.set(username, socket)
        res.status(200).json({socket: socket});
    }
}

let public_wall_controller = new publicWallController();

module.exports = {
    publicWall_get: public_wall_controller.publicWall_get,
    publicWall_post: public_wall_controller.publicWall_post,
    publicWall_alarmList_get: public_wall_controller.publicWallAlarmList_get,
    socketUpdate: public_wall_controller.socketUpdate
};