const { models, PromiseProvider } = require('mongoose');
const DeliveryRequestDAO = require('../DAO/deliveryRequestDAO');
const url = require("url");
var mode = "normal";
var _ = require('underscore');

class ProvideDeliveryController{
    async getHistoryRequests(req, res){
        var info = url.parse(req.url, true).query;
        if(info.mode == "test"){
            mode = "api";
        }
        new DeliveryRequestDAO(mode).getVolunteerRequestList(info.username)
        .then((data) => {
            res.status(200).json({"data": data});
        })
        .catch(function(err){
            res.status(500).json("server error getting history requests");
        })
    }

    async updateRequestStatus(req, res){

        if(req.body.mode == "test"){
            mode = "api";
        }
        new DeliveryRequestDAO(mode).updateRequestStatus(req.body.id, req.body.status)
        .then((data) => {

            if(req.body.status == "Finished"){
            new DeliveryRequestDAO(mode).getRequestsFromId(req.body.id)
            .then((data) =>{
                var request = data;
                
                if(request && request.length){
                    var volunteer = request[0].volunteer;
                    var username = request[0].sender;

                    let user_map = req.app.get('userMap');      
                    let global_io = req.app.get('io');

                    if (user_map.has(username) && user_map.has(volunteer)) {
                        var toId = user_map.get(username)
                        global_io.to(toId).emit("requestFinished", volunteer);
                    }
  
                    res.status(200).json("ok");
                }
                else{ res.status(304).json("deleted");}
            })
        }
            else{ res.status(200).json("ok");}
            
        })
    }

    async getPendingRequests(req, res){
        var info = url.parse(req.url, true).query;
        if(info.mode == "test"){
            mode = "api";
        }

        new DeliveryRequestDAO(mode).getPendingRequests()
        .then((data) => {
            res.status(200).json({"data": data});
        })
    }

    async acceptRequests(req, res){
        if(req.body.mode == "test"){
            mode = "api";
        }


        new DeliveryRequestDAO(mode).getRequestsFromId(req.body.id).then((data) =>{
            if(!data || data.length == 0){res.status(304).json("deleted");}
            else if(data[0].status != 'pending'){ res.status(305).json("has been dealt");}
            else{
            
        new DeliveryRequestDAO(mode).assignVolunteerToRequest(req.body.id, req.body.username)
        .then((data) => {
            new DeliveryRequestDAO(mode).getRequestsFromId(req.body.id).then((data) =>{
                var request = data;               
                if(request && request.length){
                    var volunteer = req.body.username;
                    var username = request[0].sender;

                    let user_map = req.app.get('userMap');      
                    let global_io = req.app.get('io');

                    if (user_map.has(username) && user_map.has(volunteer)) {
                        var toId = user_map.get(username); global_io.to(toId).emit("requestAccepted", volunteer);}
    
                    res.status(200).json("ok");
                }
                else{res.status(304).json("deleted");}
            });
        })
    }

        });

    }
}

var provide_delivery_controller = new ProvideDeliveryController();

module.exports = {
    getHistoryRequests: provide_delivery_controller.getHistoryRequests,
    getPendingRequests: provide_delivery_controller.getPendingRequests,
    updateRequestStatus: provide_delivery_controller.updateRequestStatus,
    acceptRequests: provide_delivery_controller.acceptRequests
}
