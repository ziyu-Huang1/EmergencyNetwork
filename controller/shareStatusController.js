"use strict";


const errorText=require('../public/const/errorText');

const JwtUtil = require('../config/JWTController');
const path = require('path');

const UserDAO = require("../DAO/userDAO");
const StatusHistoryDAO = require("../DAO/statusHistoryDAO");

class shareStatusController{
    async changeStatus(req, res) {
        let userDAO = new UserDAO();
        if(req.body.mode == "test"){
            userDAO = new UserDAO("api");
        }
        var userToken = req.headers.token;
        const username = req.body.sender;
        const status = req.body.status;
        const timestamp = req.body.time;
        const isTokenVerified = null;
        if(userToken){
            const jwt = new JwtUtil(userToken);
            isTokenVerified = jwt.verifyToken();
        }

        if (isTokenVerified || req.body.mode == "test") {
            let user = await userDAO.getUser(username);
            
            let oldStatus = user? "": String(user[0].status);

            if(oldStatus != status){
                await new StatusHistoryDAO(req.body.mode).create(username, timestamp, oldStatus, status);
                await userDAO.changeStatus(username, status, timestamp);
            }
            return res.status(200).json({username});
            
        } else {
            return res.status(500).json({});
        }
    }
    

}


let ssc = new shareStatusController();

module.exports = {
    changeStatus: ssc.changeStatus
};