const DonationRequestDB = require('../models/DonationRequest');
const url = require("url");
const DonationRequestDAO = require('../DAO/donationRequestDAO')
const DonationDAO = require('../DAO/donationDAO')
const express = require('express');

class DonationRequestController{
    async postDonationRequest(req, res){
        let donationRequestDAO = new DonationRequestDAO('normal');
        if (req.body.testing == "true"){
            donationRequestDAO = new DonationRequestDAO("api");
        }

        var reasonString = req.body.reason
        var itemName_v = req.body.itemName
        var capacity_v = req.body.capacity
        var donor_v = req.body.donor
        
        var donee_v = req.body.donee
        var requestNum_v = req.body.requestNum

        var bag = {
            itemName_v,
            capacity_v,
            donor_v
        }
        var bag1 = {
            donee_v,
            requestNum_v
        }
        donationRequestDAO.create(
            bag,
            bag1,
            reasonString,

            req.body.donationID
            ).then((result) =>{
                //donationRequestDAO.deleteMany()
                res.status(201).json({data: result});
        })
    }

    async getMyDonationRequest(req, res){
        
        let donationRequestDAO = new DonationRequestDAO('normal');
        if (req.body.testing == "true"){
            donationRequestDAO = new DonationRequestDAO("api");
        }
        donationRequestDAO.getAllMyRequest(
            req.body.donee
        ).then((result) =>{
            res.status(201).json({data: result});
        })

    }
    //get requests by donationID
    async getOtherDonationRequest(req, res){
        let donationRequestDAO = new DonationRequestDAO('normal');
        if (req.body.testing == "true"){
            donationRequestDAO = new DonationRequestDAO("api");
        }
        donationRequestDAO.getAllOtherRequestByID(
            req.body.donationID
        ).then((result) =>{
            //console.log("result: "+JSON.stringify(result))
            res.status(201).json({data: result});
        })
    }

    async getOneOtherDonationRequestDetail(req, res){
        let donationRequestDAO = new DonationRequestDAO('normal');
        if (req.body.testing == "true"){
            donationRequestDAO = new DonationRequestDAO("api");
        }

        donationRequestDAO.getOneOtherRequest(
            req.body.requestID
        ).then((result) =>{
            res.status(201).json({data: result});
        })
    }

    //after handling request, update the request status to accepted/rejected, and tell according donation to remove requestID from requestList 
    async updateOneRequestStatus(req, res){
        let donationRequestDAO = new DonationRequestDAO('normal');
        if (req.body.testing == "true"){
            donationRequestDAO = new DonationRequestDAO("api");
        }
        let donationDAO = new DonationDAO('normal');
        if (req.body.testing == "true"){
            donationDAO = new DonationDAO("api");
        }

        donationRequestDAO.updateOneOtherRequestStatus(
            req.body.requestID, 
            req.body.status
        ).then((result) =>{
            donationDAO.removeRequest(
                req.body.donationID, 
                req.body.requestID 
            ).then((result) =>{
                var requestID = req.body.requestID
                //cause a new request
                donationRequestDAO.findOneByID(requestID).then((result) =>{
                    var donee = JSON.parse(JSON.stringify(result)).donee
                    var donor = JSON.parse(JSON.stringify(result)).donor
                    console.log("cause a new reques "+donee)
                    let user_map=req.app.get('userMap')
                    let io = req.app.get('io')
                    if(user_map.has(donee)){
                        var toId = user_map.get(donee)
                        io.to(toId).emit("newReply", requestID)
                        io.to(user_map.get(donor)).emit("newReply", requestID)
                        for(var [key, value] of user_map){
                            io.to(value).emit('refreshDonation')
                        } 
                    }
                })
            })

            

            res.status(201).json({data: result})
        })
    }

    async updateRequestUnread(req,res){
        let donationRequestDAO = new DonationRequestDAO('normal');
        if (req.body.testing == "true"){
            donationRequestDAO = new DonationRequestDAO("api");
        }
        var requestID = req.body.requestID
        var unread = req.body.unread
        donationRequestDAO.updateReadStatus(requestID, unread).then((result)=>{
            res.status(200).json({data: result});
        }).catch((err)=>{
            res.status(500).json("server error updateRequestUnread");
        })
    }

    async getUnreadReply(req, res){
        let donationRequestDAO = new DonationRequestDAO('normal');
        if (req.body.testing == "true"){
            donationRequestDAO = new DonationRequestDAO("api");
        }
        var donee = req.body.username

        donationRequestDAO.getUnreadReply(donee).then((result)=>{
            res.status(200).json({data: result});
        })

    }




}

let donation_request_controller = new DonationRequestController();

module.exports = {
    postDonationRequest: donation_request_controller.postDonationRequest,
    getMyDonationRequest: donation_request_controller.getMyDonationRequest,
    getOtherDonationRequest: donation_request_controller.getOtherDonationRequest,
    getOneOtherDonationRequestDetail: donation_request_controller.getOneOtherDonationRequestDetail,
    updateOneRequestStatus: donation_request_controller.updateOneRequestStatus,
    getUnreadReply: donation_request_controller.getUnreadReply,
    updateRequestUnread: donation_request_controller.updateRequestUnread,

}