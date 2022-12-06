const MessageDAO = require('../DAO/messageDAO');
const StatusHistoryDAO = require('../DAO/statusHistoryDAO');
const UserDAO = require('../DAO/userDAO');
const AnnouncementDAO = require('../DAO/announcementDAO');

const url = require("url");
const bannedSearch = require('../public/const/bannedSearch');

class SearchInfoController{
    async userInfo(req, res) {
        var info = url.parse(req.url, true).query;
        var username = info.username;
        console.log("searching for user: ", username);
        var status = info.status;
        let userDAO = new UserDAO();
        if (info.testing == "true"){
            userDAO = new UserDAO("api")
        }
        userDAO.findAllUsers(username, status).then((data) => {
            res.status(200).json({"data": data});
        }).catch(function(err){
            console.log(err.message);
            res.status(500).json("server error searching user");
        })
    }

    async announcementInfo(req, res){
        
        // get query from req
        var info = url.parse(req.url, true).query;
        // check search validity
        var content = filterBannedWords(info.content)
        if (content.length == 0){
             return res.status(200).json({"data": ""});
        }
        var announcementDAO  = new AnnouncementDAO();
        if (info.testing == "true"){
            announcementDAO = new AnnouncementDAO("api");
        }
        announcementDAO.findAnnouncement(content, info.limit).then((result)=>{
            res.status(200).json({"data": result});
        }).catch(function(err){
            console.error(err.message);
            res.status(500).json("server error searching announcement");
        })
    }

    async publicMessageInfo(req, res){
        var info = url.parse(req.url, true).query;
        var content = filterBannedWords(info.content)
        if (content.length == 0){
            return res.status(200).json({"data": ""});
        }
        let messageDAO = new MessageDAO("normal");
        if (info.testing == "true"){
            messageDAO = new MessageDAO("api");
        }
        messageDAO.findMessages(content, info.limit).then((data) => {
            res.status(200).json({"data": data});
        }).catch(function(err){
            console.log(err.message);
            res.status(500).json("server error searching public messages");
        })
    }

    async privateMessageInfo(req, res){
        var info = url.parse(req.url, true).query;
        var content = filterBannedWords(info.content)
        if (content.length == 0){
            return res.status(200).json({"data": ""});
        }
        // display status changes
        if(info.content == "status"){
            new StatusHistoryDAO().findStatusHistory(info.receiver).then((data) => {
                res.status(200).json({"data": data});
            }).catch(function(err){
                console.log(err.message);
                res.status(500).json("server error searching status changes");
            })
        }
        else{
            let messageDAO = new MessageDAO("normal");
            if (info.testing == "true"){
                messageDAO = new MessageDAO("api");
            }
            messageDAO.findMessages(content, info.limit, info.sender, info.receiver).then((data) => {
                res.status(200).json({"data": data});
            }).catch(function(err){
                console.log(err.message);
                res.status(500).json("server error searching private messages");
            })
        }
    }

}

function filterBannedWords(searchCriteria){
    var searchWords = searchCriteria.split(' ');
    var arr = []
    for (const w in searchWords){
        if (!bannedSearch.includes(searchWords[w].toLowerCase())){
            arr.push(searchWords[w])
        }
    }
    return arr.join(' ')
}


let sic = new SearchInfoController();

module.exports = {
    userInfo: sic.userInfo,
    announcementInfo: sic.announcementInfo,
    publicMessageInfo: sic.publicMessageInfo,
    privateMessageInfo: sic.privateMessageInfo
};