const DonationRequestDB = require('../models/DonationRequest');
const url = require("url");
const DonationRequestDAO = require('../DAO/donationRequestDAO')
const DonationDAO = require('../DAO/donationDAO')
const express = require('express');

class ProvideDonationController{
    async postDonation(req, res){
        let donationDAO = new DonationDAO('normal');
        if (req.body.testing == "true"){
            donationDAO = new DonationDAO("api");
        }
        donationDAO.create(
            req.body.itemName,
            req.body.description,
            req.body.capacity,
            req.body.donor
            ).then((result) =>{
                //tell everyone the update
                let io = req.app.get('io')
                io.emit("newDonation", result)
                
                res.status(201).json({data: result});
        })

    }

    async getDonations(req, res){
        let donationDAO = new DonationDAO('normal');
        if (req.body.testing == "true"){
            donationDAO = new DonationDAO("api");
        }
        donationDAO.getAll().then((result)=>{
            res.status(201).json({data: result})
        }).catch((err)=>{
            res.status(500).json("server error retrieving all public donations")
        })}

    async getAllMyDonation(req,res){
        let donationDAO = new DonationDAO('normal');
        if (req.body.testing == "true"){
            donationDAO = new DonationDAO("api");
        }
        var donor = req.body.donor
        donationDAO.getAllMyDonation(donor).then((result)=>{
            res.status(201).json({data: result})
        }).catch((err)=>{
            res.status(500).json("server error retrieving all public donations")
        })}


    async registerRequest(req, res){
        let donationID = req.body.donationID
        let requestID = req.body.requestID
        let donationDAO = new DonationDAO('normal');
        if (req.body.testing == "true"){
            donationDAO = new DonationDAO("api");
        }
        donationDAO.addRequest(donationID, requestID).then((result) =>{
            donationDAO.findOneByID(donationID).then((result) =>{
                var donor = JSON.parse(JSON.stringify(result)).donor
                let user_map=req.app.get('userMap')
                let io = req.app.get('io')
                if(user_map.has(donor)){
                    var toId = user_map.get(donor)
                    io.to(toId).emit("newRequest", donationID)
                }else{
                    console.log("adding testing")
                }
            })

            res.status(201).json({data: result})
            //return request list of donation
            
        })
    }


    async notifyRequestStatus(req, res){
        let donationDAO = new DonationDAO('normal');
        if (req.body.testing == "true"){
            donationDAO = new DonationDAO("api");
        }

        let donationRequestDAO = new DonationRequestDAO('normal');
        if (req.body.testing == "true"){
            donationRequestDAO = new DonationRequestDAO("api");
        }

        let donationID = req.body.donationID
        let status = req.body.donationStatus
        console.log("status ing : "+status+" "+donationID)
        donationDAO.updateStatus(donationID, status).then((result) =>{
            //find donation by id
            donationDAO.findOneByID(donationID).then((result) =>{
                var curDonation = JSON.stringify(result)
                if(JSON.parse(curDonation) == null) return;
                var curRequestList = JSON.parse(curDonation).requestList
                //notify every request that the capacity has been changed
                Array.prototype.forEach.call(curRequestList, requestID=>{
                    donationRequestDAO.updateOneOtherRequestStatus(requestID, status)
                })
                //delete closed donation
                if(status=="donaiton closed"){
                    donationDAO.removeDonation(donationID)
                }
            })
            
        
            res.status(201).json({data: result})
        }).catch((err) =>{
            res.status(500).json("server error updateCapacity")
        })
        
    }

    async getUnhandledDonationRequest(req,res){

        let donationDAO = new DonationDAO('normal');
        if (req.body.testing == "true"){
            donationDAO = new DonationDAO("api");
        }

        var info = url.parse(req.url,true).query;

        donationDAO.getUnhandledDonationByDonor(info.username).then((result)=>{
            //console.log("getUnhandledDonat:"+JSON.stringify(result))
            res.status(200).json({data: result});
        }).catch((err)=>{

            res.status(500).json("server error getUnhandledDonationRequest");
        })
    }

    async notifyRequestCapacity(req, res){
        let donationDAO = new DonationDAO('normal');
        if (req.body.testing == "true"){
            donationDAO = new DonationDAO("api");
        }

        let donationRequestDAO = new DonationRequestDAO('normal');
        if (req.body.testing == "true"){
            donationRequestDAO = new DonationRequestDAO("api");
        }

        let donationID = req.body.donationID
        let capacity = req.body.capacity
        donationDAO.updateCapacity(donationID, capacity).then((result) =>{
            //find donation by id
            donationDAO.findOneByID(donationID).then((result) =>{
                var curDonation = JSON.stringify(result)
                if(JSON.parse(curDonation) == null) return
                var curRequestList = JSON.parse(curDonation).requestList
                //notify every request that the capacity has been changed
                Array.prototype.forEach.call(curRequestList, requestID=>{
                    donationRequestDAO.updateCapacity(requestID, capacity)
                })
            })
            
        
            res.status(201).json({data: result})
        }).catch((err) =>{
            res.status(500).json("server error updateCapacity")
        })

        

    }


    async removeOneDonation(req, res){
        let donationDAO = new DonationDAO('normal');
        if (req.body.testing == "true"){
            donationDAO = new DonationDAO("api");
        }

        var donationID = req.body.donationID

        let donationRequestDAO = new DonationRequestDAO('normal');
        if (req.body.testing == "true"){
            donationRequestDAO = new DonationRequestDAO("api");
        }


        var status = req.body.status

        donationDAO.updateStatus(donationID, status).then((result) =>{
            //find donation by id
            donationDAO.findOneByID(donationID).then((result) =>{
                var curDonation = JSON.stringify(result)
                if (curDonation == null) res.status(201).json({data: result})

                
                var curRequestList = JSON.parse(curDonation).requestList
                //notify every request that the capacity has been changed
                Array.prototype.forEach.call(curRequestList, requestID=>{
                    donationRequestDAO.updateOneOtherRequestStatus(requestID, status)
                })
                //delete closed donation
                if(status=="donaiton closed"){
                    donationDAO.removeDonation(donationID)
                }
            })

            let user_map=req.app.get('userMap')
            let io = req.app.get('io')
            for(var [key, value] of user_map){
                io.to(value).emit('refreshDonation')
            } 
            
            res.status(201).json({data: result})
        }).catch((err) =>{
            res.status(500).json("server error updateCapacity")
        })



        
    }
}

let provide_donation_controller = new ProvideDonationController();

module.exports = {
    postDonation: provide_donation_controller.postDonation,
    getDonations: provide_donation_controller.getDonations,
    registerRequest: provide_donation_controller.registerRequest,
    notifyRequestCapacity: provide_donation_controller.notifyRequestCapacity,
    notifyRequestStatus: provide_donation_controller.notifyRequestStatus,
    getAllMyDonation:provide_donation_controller.getAllMyDonation,
    getUnhandledDonationRequest: provide_donation_controller.getUnhandledDonationRequest,
    removeOneDonation: provide_donation_controller.removeOneDonation
};