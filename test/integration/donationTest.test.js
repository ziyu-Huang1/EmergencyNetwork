// command: set NODE_ENV=dev -> jest --detectOpenHandles apiTest
const { validate } = require('schema-utils');
let agent = require('superagent');
const JwtUtil = require('../../config/JWTController');

let PORT = 3800;
let HOST = 'http://localhost:' + PORT;

// Initiate Server


let app = require('../../app');
console.log("after server");
const APIUser = require('../../models/User').APIUser;
const APIMessage = require('../../models/Message').APIMessage;
const APIAnnouncement = require('../../models/Announcement').APIAnnouncement;
const APIDonation= require('../../models/Donation').APIDonation;
const APIDonationRequest= require('../../models/DonationRequest').APIDonationRequest;
var server;

describe('donation router', function(){

  //Dummy donations
    let donation1 = {_id:"id", itemName: "shoes", description: "donationDescription1", capacity: "10", donor: "donor1", requestList: [], status: "notDone",testing:"true"}

    let donation2 = {_id:"id",itemName: "shirt",description: "donationDescription2",capacity: "20",donor: "donor2",requestList: [],status: "notDone",testing:"true"}

    let donation3 = {_id:"id",itemName: "hair",description: "donationDescriptio3",capacity: "30", donor: "donor3",requestList: [],status: "notDone",testing:"true"}

    let request1 = {_id:"id",itemName: "shoes",capacity: "10",donor: "donor1",donee: "donee",reason: "reason",requestNum: "5",donationID: "donationID",status: "pending",time: Date.now(),unread:"true",testing:"true"}

    let request2 = { _id:"id",itemName: "shirt",capacity: "20",donor: "donor2", donee: "donee",reason: "reason",requestNum: "5",donationID: "donationID",status: "pending",time: Date.now(),unread:"true",testing:"true"}
    
    let request3 = { _id:"id",itemName: "hair",capacity: "30",donor: "donor3", donee: "donee",reason: "reason",requestNum: "6",donationID: "donationID",status: "pending",time: Date.now(),unread:"true",testing:"true"}
    let request3_2 = { _id:"id",itemName: "hair",capacity: "30",donor: "donor3", donee: "donee2",reason: "reason",requestNum: "7",donationID: "donationID",status: "pending",time: Date.now(),unread:"true",testing:"true"}


    beforeAll(async () => {
      server = await app.listen(3800);
    
    })

    let donation1_created
    let request1_created

    beforeEach(async() => {
      await APIDonation.remove();
      await APIDonationRequest.remove();


      const data = {itemName: donation1.itemName, description: donation1.description, capacity:donation1.capacity,donor:donation1.donor,testing:donation1.testing}
      donation1_created = await APIDonation.create(data)
      donation1._id = donation1_created._id
      const requestData = {itemName: request1.itemName, capacity: request1.capacity, donor:request1.donor, donee: request1.donee, reason: request1.reason, requestNum: request1.requestNum, donationID: donation1._id, testing: request1.testing}
      request1_created = await APIDonationRequest.create(requestData)
      request1._id = request1_created._id
      
    });
    
    afterAll(async () => {
      await APIDonation.remove();
      await APIDonationRequest.remove();
      await server.close();

    
    });

    test('can create a new donation', (done) => {
      const data = {itemName: donation2.itemName, description: donation2.description, capacity:donation2.capacity,donor:donation2.donor,testing:donation2.testing}
      agent.post(HOST + '/donations')
        .send(data)
        .end(function (err, res) {

          expect(res.statusCode).toBe(201);
          agent.get(HOST + '/donations')
            .send(data)
            .end(function (err, res) {
              let donations = res.body.data;
              let dataLen = donations.length
              let foundCnt
              for(let j=0; j<dataLen; j++){
                if(donations[j].itemName == data.itemName){
                  foundCnt=donations[j].itemName
                }
              }
              expect(foundCnt).toBe(donation2.itemName);
              done();
            });
        });
    });


    test('post a request application',(done) =>{
      const requestData = {itemName: request2.itemName, capacity: request2.capacity, donor:request2.donor, donee: request2.donee, reason: request2.reason, requestNum: request2.requestNum, donationID:donation1._id, testing: request2.testing}
      agent.post(HOST + '/donations/request')
        .send(requestData)
        .end(function(err, res){
          expect(res.statusCode).toBe(201);
          done();
        })
    });


    test('get all my requests', (done) =>{
      const data = {testing: "true", donee: "donee"}
      agent.put(HOST + '/donations/myRequests')
        .send(data)
        .end(function(err, res){
          expect(res.statusCode).toBe(201);
          done();
        })
    })


    test('get all the requests by donation ID', (done) =>{
      const data = {testing: "true", donationID: donation1._id}
      agent.put(HOST + '/donations/otherRequests')
        .send(data)
        .end(function(err, res){
          expect(res.statusCode).toBe(201);
          done();
        })
    })


    test('get request be request ID', (done)=>{
      const data = {testing: "true", requestID: request1._id}
      agent.put(HOST + '/donations/otherRequest/detail')
        .send(data)
        .end(function(err, res){
          console.log("ressssss: "+res["data"])
          expect(res.statusCode).toBe(201);
          done();
        })
    })

    test('register a request in donation request list', (done)=>{
      const data = {testing: "true", requestID: request2._id, donationID: donation1._id}
        agent.put(HOST + '/donations/addRequest')
        .send(data)
        .end(function(err, res){
          expect(res.statusCode).toBe(201);
          done();
        })
    })

    // test('notifyRequestCapacity after the donation capacity has been changed', (done)=>{
    //   const data = {testing: "true", capacity: "5", donationID: donation1._id}
    //     agent.put(HOST + '/donations/capacity')
    //     .send(data)
    //     .end(function(err, res){
    //       expect(res.statusCode).toBe(201);
    //       done();
    //     })
    // })

    test('after handling request, update the request status to accepted/rejected', (done)=>{
      const data = {testing: "true", status: "Rejected", requestID: request1._id}
        agent.put(HOST + '/donations/otherRequest/update')
        .send(data)
        .end(function(err, res){
          expect(res.statusCode).toBe(201);
          done();
        })
    })

    test('notifyRequestStatus after the donation capacity has been changed', (done)=>{
      const data = {testing: "true", donationID: donation1._id, donationStatus: "done"}
        agent.put(HOST + '/donations/status')
        .send(data)
        .end(function(err, res){
          expect(res.statusCode).toBe(201);
          done();
        })
    })

    test('notifyRequestStatus after the donation capacity has been changed donation closed', (done)=>{
      const data = {testing: "true", donationID: donation1._id, donationStatus: "donaiton closed"}
        agent.put(HOST + '/donations/status')
        .send(data)
        .end(function(err, res){
          expect(res.statusCode).toBe(201);
          done();
        })
    })

    test('getUnhandledDonationRequest',(done)=>{
        const data = {testing: "true", donationID: donation1._id, donationStatus: "donaiton closed"}
        agent.get(HOST + '/donations/otherRequest/pendingList')
        .send(data)
        .end(function(err, res){
          expect(res.statusCode).toBe(200);
          done();
        })
    })

    test('notifyRequestCapacity',(done)=>{
      const data = {testing: "true", donationID: donation1._id, donationStatus: "donaiton closed"}
      agent.get(HOST + '/donations/capacity')
      .send(data)
      .end(function(err, res){
        expect(res.statusCode).toBe(200);
        done();
      })
    })


    test('get all my donations by donor', (done)=>{
      const data = {testing: "true", donor: "donor"}
        agent.put(HOST + '/donations/myDonations')
        .send(data)
        .end(function(err, res){
          expect(res.statusCode).toBe(201);
          done();
        })
    })


    test('update the unread status of a request', (done)=>{
      const data = {testing: "true", requestID: request1._id, unread:"false"}
        agent.put(HOST + '/donations/myRequests/unread')
        .send(data)
        .end(function(err, res){
          expect(res.statusCode).toBe(200);
          done();
        })
    })

    test('remove one database', (done)=>{
      const data = {testing: "true", donationID: donation1._id, status:"donaiton closed"}
      agent.put(HOST + '/donations/removeDonation')
      .send(data)
      .end(function(err, res){
        expect(res.statusCode).toBe(201);
        done();
      })
    })

    test('notifyRequestCapacity',(done)=>{
      const data = {testing: "true", donationID: donation1._id, capacity: "10"}
      agent.put(HOST + '/donations/capacity')
      .send(data)
      .end(function(err, res){
        expect(res.statusCode).toBe(201);
        done();
      })
    })


    test('getUnreadReply',(done)=>{
      const data = {testing: "true", username: "donee"}
      agent.put(HOST + '/donations/unreadReplyList')
      .send(data)
      .end(function(err, res){
        //expect(res.statusCode).toBe(201);
        done();
      })
    })



})

