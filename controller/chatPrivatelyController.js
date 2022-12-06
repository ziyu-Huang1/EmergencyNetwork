const MessageDBs = require('../models/Message');
const url = require("url");
const {query} = require("express");
const MessageDAO = require('../DAO/messageDAO');
const UserDAO = require('../DAO/userDAO')
const Message = require('../models/Message');
const e = require('express');
class chatPrivatelyController{


    async privateChat_get(req, res) {
        var info = url.parse(req.url,true).query;
        let messageDAO ;
        if (global.measureMode){
            messageDAO = new MessageDAO("measure");
        }else if (req.body.testing == "true"){
            messageDAO = new MessageDAO("api");
        
        }else{
            messageDAO = new MessageDAO("normal");
            
        }

        var sender = info.sender;
        var receiver = info.receiver;
        // just for integration testing
        if (sender== null &&  receiver == null) {
            sender = req.body.sender;
            receiver = req.body.receiver;
        }
       
        messageDAO.loadPrivateMessage(sender, receiver).then((result)=>{
            messageDAO.updateIfRead(sender, receiver);
            res.status(200).json({msglist: result});
        })
    }

    async updateIfread_get(req, res) {
        var info = url.parse(req.url,true).query;
        let messageDAO ;
        
        if (global.measureMode){
            messageDAO = new MessageDAO("measure")
        }else if (req.body.testing == "true"){
            messageDAO = new MessageDAO("api")
        }else{
            messageDAO = new MessageDAO("normal")
        }
   
        messageDAO.updateIfRead(info.sender, info.receiver).then((result)=>{
            res.status(200).json({msglist: result});
        })
    }

    async privateChatSocket_get(req, res){
        
   
        userDAO.getSocketID(req.body.username).then((result)=>{
            res.status(200).json({user: result});
        })
    }

    async privateChat_post(req, res) {
        
        let messageDAO ;
        
        if (global.measureMode){
            messageDAO = new MessageDAO("measure")
        }else if (req.body.testing == "true"){
            messageDAO = new MessageDAO("api")
        }else{
            messageDAO = new MessageDAO("normal")
        }
   
        let user_map = req.app.get('userMap');

        messageDAO.create(
            req.body.message,
            req.body.sender,
            req.body.receiver,
            req.body.type,
            req.body.time,
            req.body.status,
            false).then((result)=>{
                var receiver = req.body.receiver;
                let global_io = req.app.get('io');
                if (user_map.has(receiver)) {
                    var toId = user_map.get(receiver)
                    console.log("send to", receiver, toId);
                    global_io.to(toId).emit("privateMsg", result);
                }
            res.status(201).json({ret: result});
        })
    }
}

let chat_privately_controller = new chatPrivatelyController();      
module.exports = {
    privateChat_get: chat_privately_controller.privateChat_get,
    privateChat_post: chat_privately_controller.privateChat_post,
    updateIfread_get: chat_privately_controller.updateIfread_get,
    privateChatSocket_get: chat_privately_controller.privateChatSocket_get
};