const errorText=require('./public/const/errorText');
const express = require('express');
const index = require('./routes/index');
const app = express();
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const UserDAO = require('./DAO/userDAO')
const publicWallRouter = require('./routes/publicWall.js');
const usersRouter = require('./routes/users');
const measureRouter = require('./routes/measure');
const chatPrivatelyRouter = require('./routes/chatPrivately');
const statusRouter=require('./routes/status');
const postAnnouncementRouter = require('./routes/postAnnouncement');
const searchInfoController = require('./routes/searchInfo');
const deliveryRouter = require('./routes/delivery');
const joinShelterRouter = require('./routes/joinShelter');
const shopRouter = require('./routes/shop');
const searchInfoRouter = require('./routes/searchInfo');
const donationRouter = require('./routes/donation');
const emergencyContactRouter = require('./routes/emergencyContact');
const adminRouter = require('./routes/admin')


const path = require('path');
const http = require('http');
const server = http.createServer(app);
const socketio = require('socket.io');
const message = require("./models/Message");
const io = socketio(server);
const MeasureTool = require("./config/measureTool");

const MessageDAO = require('./DAO/messageDAO');
const { get } = require('config');
// for demo 
const port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname + '/views_refator_temp'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

// global variable to indicate whether we are in measure performance Mode
global.measureMode = false;
global.measureTool = new MeasureTool();
const checkMode = function (req, res, next) {
    if (req.body.measurePerformance == "True"){
        next();
    } 
    else if(req.url == "/public?isMeasurePerformance=true"){  // if get uri is ended with true
        next();
    }
    else{
        if (global.measureMode){
            return res.status(503).json({errors: [{msg:errorText.measurePerformanceInfo.systemUnavaliable}]});
            
        } else {
            next();
        }
    } 
  }

app.use(['/users','/messages'], checkMode);

//routers
app.use('/', index);
app.use('/measure', measureRouter);
app.use('/users',usersRouter);
app.use('/messages/public',publicWallRouter);
app.use('/messages/private', chatPrivatelyRouter);
app.use('/status',statusRouter);
app.use('/announcements', postAnnouncementRouter);
app.use('/info', searchInfoController);
app.use('/deliverys', deliveryRouter);
app.use('/shelters', joinShelterRouter);
app.use('/info', searchInfoRouter);
app.use('/donations',donationRouter)
app.use('/emergencyContacts', emergencyContactRouter);
app.use('/admin', adminRouter)

app.use('/shop', shopRouter);


app.set("view engine", 'html');

app.get('/public/announcement', (req, res) =>{
    res.sendFile(__dirname + '/public/announcement.js');
})

app.get('/public/shelter', (req, res) =>{
    res.sendFile(__dirname + '/public/shelter.js');
})

app.get('/public/publicWall', (req, res) =>{
    res.sendFile(__dirname + '/public/publicWall.js');
})
app.get('/public/privateChat', (_req, res) =>{  
    res.sendFile(__dirname + '/public/privateChat.js');
})

app.get('/public/directory', (req, res) =>{
    res.sendFile(__dirname + '/public/directory.js');
})

app.get('/public/donation', (req, res) =>{
    res.sendFile(__dirname + '/public/donation.js');
})
app.get('/public/donation_form', (req, res) =>{
    res.sendFile(__dirname + '/public/donation_form.js');
})

app.get('/public/donationRequest_form', (req, res) =>{
    res.sendFile(__dirname + '/public/donationRequest_form.js');
})

app.get('../controller/shareStatus', (req, res) =>{
    res.sendFile(path.join(__dirname,'..','views','shareStatusPage.html'));
})

app.get('/public/socket', (req, res) =>{
    res.sendFile(__dirname + '/public/socket.js');
})

app.get('/public/deliverys', (req, res) =>{
    res.sendFile(__dirname + '/public/foodDelivery.js');
})

app.get('/public/userProfile', (req, res) =>{
    res.sendFile(__dirname + '/public/userProfile.js');
})

app.get('/public/emergencyContact', (req, res)=> {
    res.sendFile(__dirname + '/public/emergencyContact.js');
})

app.get('/public/jumpPage', (req, res)=> {
    res.sendFile(__dirname + '/public/jumpPage.js');
})

app.get('/public/emergencyContact', (req, res)=> {
    res.sendFile(__dirname + '/public/emergencyContact.js');
})

app.get('/public/adminUserProfile', (req, res) => {
    res.sendFile(__dirname + '/public/adminUserProfile.js');
});



app.get('/public/shop', (req, res) =>{
    res.sendFile(__dirname + '/public/shop.js');
})



app.get('/public/myDonationRequest',(req, res)=>{
    res.sendFile(__dirname + '/public/myDonationRequest.js');
})


var userMap = new Map();
app.set('userMap', userMap);
app.set('io',io)





//DAO
let userDAO  = new UserDAO("noormal");
let messageDAO= new MessageDAO("normal");


io.on("connection", (socket) => {
    userMap.set(socket.handshake.query.user, socket)


    socket.on('showWall', ()=>{
        
        messageDAO.loadPublicMessage().then((result)=>{
            io.emit('allMsg', result.reverse());
        })
    })

    socket.on('showActiveUser', ()=>{
        userDAO.getAllActiveUsers().then((result)=>{
            io.emit('allActiveUsers', result);
        })
    })

    socket.on('showUser', ()=>{
        userDAO.getAllUsers().then((result)=>{
            io.emit('allUsers', result);
        })
    })

    socket.on('updateShowingStatus', function(msg){
        userDAO.getAllActiveUsers().then((result)=>{
            io.emit('allUsers', result); 
        })
    })

    socket.on('disconnect', function () {
        userMap.delete(socket.handshake.query.user);
    });

});





server.listen(port,function(err, res) {
    if(err) {
        console.log("Error message: " + err);
    } else {
        console.log("server started");
    }
});






module.exports = app;