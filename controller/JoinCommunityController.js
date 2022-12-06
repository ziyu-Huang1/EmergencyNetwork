"use strict";

const bannedList = require("../public/const/bannedName");
const errorText=require('../public/const/errorText');
const joinInCommunityErrors=errorText.joinInCommunityErrors;
const joinInCommunityInform=errorText.joinInCommunityInform;
const JwtUtil = require('../config/JWTController');
const path = require('path');
const UserDAO = require('../DAO/userDAO');
const e = require("express"); 


class JoinCommunityController{

    async ExistUserLogin(req, res) {
        let userDAO ;

        if (req.body.testing == "true"){
            userDAO = new UserDAO("api");
        }else{
            userDAO = new UserDAO("normal");
        }

        console.log(userDAO);
        const data = req.body;

        const username = data.username;
        const password = data.password;

        if(isBannedUserName(username)){
            return res.status(400).json({errors: [{msg: joinInCommunityErrors.userBanned}]});
        }
        try {

            let user = await userDAO.findUser(username);
            if (user) {

                //find user and check whether it is inactive
                if(user.accountStatus != "active"){
                    return res.status(403).json({ errors: [{ msg: joinInCommunityErrors.userInactive}] });

                }
                if(user.password != password){
                    return res.status(400).json({errors: [{msg: joinInCommunityErrors.wrongPassword}]});
                }
                const jwt = new JwtUtil({'username': username});
                var token = jwt.generateToken();
                console.log(token);
                await userDAO.updateOnlineStatus(user.username, true);
                return res.status(200).json({"token": token, "status":  user.status, "username": user.username, 'privilege': user.privilege});
            } else {
                return res.status(404).json({errors: [{msg: joinInCommunityErrors.userNotFound}]});
            }
        } catch (err) {
                return res.status(500).json({errors: [{msg:joinInCommunityErrors.serverError}]});
        }
    }


    async LoginCommunity (req, res) {
        console.log('LoginCommunity');

        let userDAO ;
        if (global.measureMode){
            userDAO = new UserDAO("measure")
        }else if (req.body.testing == "true"){
            userDAO = new UserDAO("api")
        }else{
            userDAO = new UserDAO("normal")
        }

        const username = req.body.username;
        const password = req.body.password;

    
        if(isBannedUserName(username)){
            return res.status(400).json({errors: [{msg: joinInCommunityErrors.userBanned}]});
        }


        try {
            let user = await userDAO.findUser(username);

            if (user) {

                res.status(401).json({ errors: [{ msg: joinInCommunityInform.userExist }] });


            }


            else {
                let user = userDAO.create(username, password);
                const jwt = new JwtUtil({'username': username});
                var token = jwt.generateToken();
                res.status(201).json({"token": token, "username": user.username, 'privilege': user.privilege});
            }
            
        } catch (err) {
            console.error(err.message);

        }
    }

    async logOut(req, res) {
        let userDAO ;

        if (req.body.testing == "true"){
            userDAO = new UserDAO("api")
        }else{
            userDAO = new UserDAO("normal")
        }
        var userToken = req.headers.token;
        const obj = Object.keys(JSON.parse(JSON.stringify(req.body)));

        const username = JSON.parse(obj).username;
        

        const jwt = new JwtUtil(userToken);
        const isTokenVerified = jwt.verifyToken();

        if (true) {
            await userDAO.updateOnlineStatus(username, false);
            res.sendFile(path.join(__dirname,'..','views','join.html'));
            var invalid = "";
            res.status(200).json({invalid});
            
        } else {
        }
                
    }

    async getAllUsers(req, res){
        console.log("getAllUser", req.body);
        let userDAO ;
        // if (global.measureMode){
        //     userDAO = new UserDAO("measure")
        // }else 
        if (req.body.testing == "true"){
            userDAO = new UserDAO("api")
        }else{
            userDAO = new UserDAO("normal")
        }
        
        try {
            let users = await userDAO.getAllUsers();
            res.status(201).json({users});
    
        } catch (err) {
            console.error(err.message);
            res.status(500).send(joinInCommunityErrors.serverError);
        }
    }

}

function isBannedUserName(username){
    return bannedList.includes(username.toLowerCase());
}

let jcc = new JoinCommunityController();

module.exports = {
    LoginCommunity: jcc.LoginCommunity,
    ExistUserLogin: jcc.ExistUserLogin,
    logOut: jcc.logOut,
    getAllUsers: jcc.getAllUsers,
    getESN: jcc.getESN

};



