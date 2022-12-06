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
const deliveryRouter = require('./routes/delivery');
const postAnnouncementRouter = require('./routes/postAnnouncement');
const searchInfoController = require('./routes/searchInfo');
const chatPrivatelyRouter = require('./routes/chatPrivately');
const statusRouter=require('./routes/status');
const searchInfoRouter = require('./routes/searchInfo');
const donationRouter = require('./routes/donation');
const joinShelterRouter = require('./routes/joinShelter');


const path = require('path');
const http = require('http');
const server = http.createServer(app);
const message = require("./models/Message");

const MeasureTool = require("./config/measureTool");

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname + '/views_refator_temp'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

// global variable to indicate whether we are in measure performance Mode
global.measureMode = false;
global.measureTool = new MeasureTool();
const checkMode = function (req, res, next) {
    next()
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
app.use('/info', searchInfoRouter);
app.use('/donations',donationRouter)
app.use('/shelters', joinShelterRouter);



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
});


var userMap = new Map();
app.set('userMap', userMap);


app.get('/public/userProfile', (req, res) =>{
    res.sendFile(__dirname + '/public/userProfile.js');
})


app.get('/public/myDonationRequest',(req, res)=>{
    res.sendFile(__dirname + '/public/myDonationRequest.js');
})

var userMap = new Map();






module.exports = app;