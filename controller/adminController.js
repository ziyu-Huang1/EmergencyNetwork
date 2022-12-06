const UserDAO = require('../DAO/userDAO');
const AddressDAO = require('../DAO/addressDAO');
const DonationDAO = require('../DAO/donationDAO');
const DonationRequestDAO = require('../DAO/donationRequestDAO');
const MessageDAO = require('../DAO/messageDAO');
const ShelterDAO = require('../DAO/shelterDAO');
const DeliveryRequestDAO = require('../DAO/deliveryRequestDAO');
const EmergencyContactDAO = require('../DAO/emergencyContactDAO');
const ShopEventDAO = require('../DAO/shopEventDAO');
const StatusHistoryDAO = require('../DAO/statusHistoryDAO');
const AnnouncementDAO = require('../DAO/announcementDAO')

const url = require("url")
const bannedList = require("../public/const/bannedName");
const errorText=require('../public/const/errorText');
const joinInCommunityErrors=errorText.joinInCommunityErrors;

class adminController{

    async getProfile(req, res){
        var info = url.parse(req.url, true).query;
        let userDAO = new UserDAO('normal')
        if (info.testing == 'true'){
            userDAO = new UserDAO('api')
        }
        userDAO.getUser(info.username).then((result)=>{
            res.status(200).json({ret: result})
        })
    }

    async changeProfile(req,res){
        let userDAO = new UserDAO('normal')
        let addressDAO = new AddressDAO('normal')
        let donationDAO = new DonationDAO('normal')
        let donationRequestDAO = new DonationRequestDAO('normal')
        let messageDAO = new MessageDAO('normal')
        let shelterDAO = new ShelterDAO('normal')
        let deliveryRequestDAO = new DeliveryRequestDAO('normal')
        let emergencyContactDAO = new EmergencyContactDAO('normal')
        let shopEventDAO = new ShopEventDAO('normal')
        let statusHistoryDAO = new StatusHistoryDAO('normal')
        let announcementDAO = new AnnouncementDAO('mormal')
        
        if (req.body.testing == 'true'){
            userDAO = new UserDAO('api')
            addressDAO = new AddressDAO('api')
            donationDAO = new DonationDAO('api')
            donationRequestDAO = new DonationRequestDAO('api')
            messageDAO = new MessageDAO('api')
            shelterDAO = new ShelterDAO('api')
            deliveryRequestDAO = new DeliveryRequestDAO('api')
            emergencyContactDAO = new EmergencyContactDAO('api')
            shopEventDAO = new ShopEventDAO('api')
            statusHistoryDAO = new StatusHistoryDAO('api')
            announcementDAO = new AnnouncementDAO('api')
        }


        var username = req.body.username
        var formerUsername = req.body.formerUsername
        var password = req.body.password
        var privilege= req.body.privilege
        var accountStatus = req.body.accountStatus

        console.log("username: "+username+" password: "+password+" privilege: "+privilege+" accountStatus: "+accountStatus )
        // the username is valid or not
        if(isBannedUserName(username)){
            return res.status(400).json({errors: [{msg: joinInCommunityErrors.userBanned}]});
        }

        let global_io = req.app.get('io');
        let user_map=req.app.get('userMap')

        //update the accountStatus
        if(accountStatus == "inactive"){
            console.log("inactive d")
            if(user_map.has(formerUsername)){
                var toId = user_map.get(formerUsername)
                global_io.to(toId).emit('logout')
            }
        }

        //update the privilege
        if(user_map.has(formerUsername)){
            var toId = user_map.get(formerUsername)
            global_io.to(toId).emit('privilegeChange',privilege)
        }
        

        // the username has been used or not
        if(formerUsername != username){
            userDAO.findUser(username).then((result)=>{
                if(result != null){
                    return res.status(400).json({errors: [{msg: "The username has been used"}]});
                }
            })
        }

        userDAO.changeProfileWithPassword(formerUsername, username, password, privilege, accountStatus).then((result)=>{

            var data = {
                'formerUsername': formerUsername,
                'username': username
            }
            for(var [key, value] of user_map){
                global_io.to(value).emit('refreshOtherUserName',data)
            } 
            res.status(200).json({ret: result})
        })


        //update user_map
        var formerValue = user_map.get(formerUsername)
        if(user_map.has(formerUsername)){
            user_map.delete(formerUsername)
            console.log("new username: "+username)
            user_map.set(username, formerValue) 
        }


        if (username != formerUsername){
            shelterDAO.changeUsername(username, formerUsername)
            donationRequestDAO.changeDoneeUsername(username, formerUsername)
            donationRequestDAO.changeDonorUsername(username, formerUsername)
            donationDAO.changeUsername(username, formerUsername)
            messageDAO.changeReceiverUsername(username, formerUsername)
            messageDAO.changeSenderUsername(username, formerUsername)
            addressDAO.changeUsername(username, formerUsername)
            announcementDAO.changeUsername(username, formerUsername)
            emergencyContactDAO.changeUsername(username, formerUsername)
            statusHistoryDAO.changeUsername(username, formerUsername)
            shopEventDAO.changeUsername(username, formerUsername)
            deliveryRequestDAO.changeSenderUsername(username, formerUsername)
            deliveryRequestDAO.changeVolunteerUsername(username, formerUsername)
        }

    }

}

function isBannedUserName(username){
    return bannedList.includes(username.toLowerCase());
}

let admin_controller = new adminController()

module.exports = {
    getProfile: admin_controller.getProfile,
    changeProfile: admin_controller.changeProfile
}