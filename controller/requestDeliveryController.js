const { models } = require('mongoose');
const DeliveryRequestDAO = require('../DAO/deliveryRequestDAO');
const AddressDAO = require('../DAO/addressDAO');
const url = require("url");
const { off } = require('process');
var mode = "normal";

// test
// address
// map color

class RequestDeliveryController{
    async createNewRequest(req, res) {
        if(req.body.mode == "test"){
            mode = "api";
        }

        var addrRes = await new AddressDAO(mode).getUserAddress(req.body.username);
        console.log(addrRes);

        if(addrRes){
            if(addrRes.length > 0){
                new AddressDAO(mode).updateUserAddress(
                    req.body.username, 
                    req.body.address, 
                    req.body.x, 
                    req.body.y);
            }
            else{
                new AddressDAO(mode).create(
                    req.body.username, 
                    req.body.address, 
                    req.body.x, 
                    req.body.y);
            }
        }

        new DeliveryRequestDAO(mode).create(
            req.body.description, 
            req.body.username, 
            req.body.volunteer,
            new Date(), 
            "pending", 
            req.body.position,
            req.body.address,
            req.body.contact,
            req.body.x,
            req.body.y)
            .then((data) => {
                res.status(200).json("ok");
            })
            .catch(function(err){
                console.log(err);
                res.status(500).json("server error creating new request");
            });
    }

    async getHistoryRequests(req, res){
        var info = url.parse(req.url, true).query;
        if(info.mode == "test"){
            mode = "api";
        }

        new DeliveryRequestDAO(mode).getUserRequestList(info.username)
        .then((data) => {
            res.status(200).json({"data": data});
        })
        .catch(function(err){
            console.log(err);
            res.status(500).json("server error getting history requests");
        })
    }

    async cancelPendingRequest(req, res){
        if(req.body.mode == "test"){
            mode = "api";
        }
        new DeliveryRequestDAO(mode).delete(req.body.id)
        .then((data) => {
            res.status(200).json("ok");
        })
        .catch(function(err){
            console.log(err);
            res.status(500).json("server error deleting history requests");
        });
    }

    async getUserAddress(req, res){
        var info = url.parse(req.url, true).query;
        if(info.mode == "test"){
            mode = "api";
        }
        new AddressDAO(mode).getUserAddress(info.username)
        .then((data) => {
            res.status(200).json({"data": data});
        })
        .catch(function(err){
            console.log(err);
            res.status(500).json("server error getting user address");
        })
    }

    async updateUserAddress(req, res){
        if(req.body.mode == "test"){
            mode = "api";
        }

        var addrRes = await new AddressDAO(mode).getUserAddress(req.body.username);
        console.log(addrRes);

        if(addrRes){
            if(addrRes.length > 0){
                new AddressDAO(mode).updateUserAddress(
                    req.body.username, 
                    req.body.address, 
                    req.body.x, 
                    req.body.y)
                    .then((data) => {
                        res.status(200).json({"data": data});
                    })
                    .catch(function(err){
                        console.log(err);
                        res.status(500).json("server error updating user address");
                    })
            }
            else{
                new AddressDAO(mode).create(
                    req.body.username, 
                    req.body.address, 
                    req.body.x, 
                    req.body.y)
                    .then((data) => {
                        res.status(200).json({"data": data});
                    })
                    .catch(function(err){
                        console.log(err);
                        res.status(500).json("server error updating user address");
                    })
            }
        }
    }
};

let request_delivery_controller = new RequestDeliveryController();

module.exports = {
    createNewRequest: request_delivery_controller.createNewRequest,
    getHistoryRequests: request_delivery_controller.getHistoryRequests,
    cancelPendingRequest: request_delivery_controller.cancelPendingRequest,
    getUserAddress: request_delivery_controller.getUserAddress,
    updateUserAddress: request_delivery_controller.updateUserAddress
}