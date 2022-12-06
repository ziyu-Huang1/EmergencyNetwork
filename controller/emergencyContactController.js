const emergencyContactDao = require('../DAO/emergencyContactDAO');
const UserDAO = require('../DAO/userDAO');
const url = require("url");
const MessageDAO = require('../DAO/messageDAO');
const { exit } = require('process');
const JwtUtil = require('../config/JWTController');

class emergencyContactController{
    async editContacts(req, res){
        let emergencyContactDAO ;
        if (req.body.testing == "true"){
            emergencyContactDAO = new emergencyContactDao("api");
        }else{
            emergencyContactDAO = new emergencyContactDao("normal");
        }
        let userDAO ;
        if (req.body.testing == "true"){
            userDAO = new UserDAO("api")
        }else{
            userDAO = new UserDAO("normal")
        }

        // verify token
        const userToken = req.headers.token; 
        const jwt = new JwtUtil(userToken);
        var contact1 = req.body.contact1;
        var contact2 = req.body.contact2;
        var contact3 = req.body.contact3;

        var username = req.body.username;

        let isTokenVerified = jwt.verifyToken();
        
        if (isTokenVerified.data.username != username){
            res.status(498).json({msg:"Please login again"});
            return;
        }
        

        try {
            if (contact1 != ""){  
                let user1 = await userDAO.findUser(contact1);
                if (user1 == null){
                    console.log('contact1 not found');
                    return res.status(404).json({errors: [{msg: "No such user found", contact: contact1}]});
                }
            
            }
            if (contact2 != "" ){  
                let user2 = await userDAO.findUser(contact2);
                if (user2 == null){
                    console.log('contact2 not found');
                    return res.status(404).json({errors: [{msg: "No such user found", contact: contact2}]});
                }
               
            }
            if (contact3 != ""){  
                let user3 = await userDAO.findUser(contact3);
                if (user3 == null){
                    console.log('contact3 not found');
                    return res.status(404).json({errors: [{msg: "No such user found", contact: contact3}]});
                }
            }
            if (contact1 ==""){
                contact1 = "undefined";
            }
            if (contact2 ==""){
                contact2 = "undefined";
            }
            if (contact3 ==""){
                contact3 = "undefined";
            }
            let user = await emergencyContactDAO.findContacts(username);
            if (user){
                emergencyContactDAO.editContact(username, contact1, contact2, contact3).then((result) => {
                    console.log('from editContact');
                    res.status(200).json({data: result});
                })
                

            } else {
                emergencyContactDAO.createContact(username, contact1, contact2, contact3).then((result) => {
                    console.log('from create');
                    res.status(200).json({data: result});
                })

            }


        }catch(err){
            res.status(500).json({errors: [{msg: "emergency contact server error"}]});

        }

    }

    async loadContacts(req, res){
        // verify token
        const userToken = req.headers.token; 
        const jwt = new JwtUtil(userToken);
        const isTokenVerified = jwt.verifyToken();
        var username = req.url.split('/')[2];
        
        let emergencyContactDAO ;
        if (req.body.testing == "true"){
            emergencyContactDAO = new emergencyContactDao("api");
        }else{
            emergencyContactDAO = new emergencyContactDao("normal");
        }

        try {
            
            let user = await emergencyContactDAO.findContacts(username);
            res.status(200).json({data: user});
        }catch(err){
            res.status(500).json({errors: [{msg: "emergency contact server error"}]});

        }

    }

    async sendMsg(req, res){
        // verify token
        const userToken = req.headers.token; 
        const jwt = new JwtUtil(userToken);
        let isTokenVerified = jwt.verifyToken();
        let data = req.body;
        let username = data.username;

        if (isTokenVerified.data.username != username){
            res.status(498).json({msg:"Please login again"});
            return;
        }
        
        let sender = data.username;
        let contact1 = data.contact1;
        let contact2 = data.contact2;
        let contact3 = data.contact3;
        let msg  = data.message;

        let messageDAO ;
        
        if (req.body.testing == "true"){
            messageDAO = new MessageDAO("api")
        }else{
            messageDAO = new MessageDAO("normal")
        }

        let user_map = req.app.get('userMap');
    
        try {if (contact1 != ""){
            messageDAO.create(msg,sender,contact1, 'private', new Date(),'OK',false).then((result)=>{
                if (user_map.has(contact1)) {
                    user_map.get(sender).to(user_map.get(contact1).id).emit("privateMsg", result)
                }
            })

        }
        if (contact2 != ""){

            messageDAO.create(msg,sender,contact2, 'private', new Date(),'OK',false).then((result)=>{
                if (user_map.has(contact2)) {
                    user_map.get(sender).to(user_map.get(contact2).id).emit("privateMsg", result)
                }
                
            })
        }

        if (contact3 != ""){

            messageDAO.create(msg,sender,contact3, 'private', new Date(),'OK',false).then((result)=>{
                if (user_map.has(contact3)) {
                    user_map.get(sender).to(user_map.get(contact3).id).emit("privateMsg", result)
                }
                
            })


        }}catch(err){   
                return res.status(500).json("server error posting msg");
                
            }

        return res.status(200).json("msg sent to all contacts");


    }
    
}


let emergency_contact_controller = new emergencyContactController();

module.exports = {
    editContacts: emergency_contact_controller.editContacts,
    loadContacts: emergency_contact_controller.loadContacts,
    sendMsg: emergency_contact_controller.sendMsg
}