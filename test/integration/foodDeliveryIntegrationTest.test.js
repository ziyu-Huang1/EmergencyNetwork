'use strict';

var DeliveryRequestDAO = require('../../DAO/deliveryRequestDAO');
var RequestDeliveryController = require('../../controller/requestDeliveryController');
var ProvideDeliveryController = require('../../controller/provideDeliveryController');
const { validate } = require('schema-utils');

let agent = require('superagent');
// let app = require('../../server');
let app = require('../../simulateServer');
const { JsonWebTokenError } = require('jsonwebtoken');
var server;


let PORT = 3700;
let HOST = 'http://localhost:' + PORT;


var request ={
    description: "Good morning",
    address: "",
    contact: "",
    x: "0",
    y: "0",
    sender:"john",
    volunteer: "",
    time: new Date(),
    status: "Finished",
    position: ""
}

describe('food delivery tests', function(){

    let deliveryRequestDAO;
    var sampleReq =
    {
        "description": "GG123",
        "username":"1",
        "volunteer": "",
        "position": "",
        "status": "Finished",
        "mode": test
    };

    beforeAll( async ()=>{
        server = await app.listen(PORT);
        deliveryRequestDAO = new DeliveryRequestDAO("api");
    });

    beforeEach(()=>{
      
    });

    afterEach(()=>{
    });

    afterAll(async()=>{
        await server.close();
    })


    // description, sender, volunteer, time, status, postion, address, contact, x, y
    test('delete a delivery request', (done)=>{
        agent.post(HOST + '/deliverys/userRequests')
        .send(sampleReq)
        .end(function (err, res) {
            expect(res.statusCode).toBe(200);

            agent.get(HOST + '/deliverys/userRequests?mode=test&username=1')
            .end(function (err, res) {
                let msgs = res.body.data;
                let id = null;
                for (let j= 0; j < msgs.length; j++){
                  id = msgs[j]._id;
                }

                var deleteReq = {
                    "id": id,
                    "mode": "test"
                };
    
                agent.delete(HOST + '/deliverys/userRequests')
                .send(deleteReq)
                .end(function (err, res) {
                    expect(res.statusCode).toBe(200);
                    done();
                });
            });
        });
    })

    test('create a new delivery request', (done)=>{
        agent.post(HOST + '/deliverys/userRequests')
        .send(sampleReq)
        .end(function (err, res) {
            expect(res.statusCode).toBe(200);

            agent.get(HOST + '/deliverys/userRequests?mode=test&username=1')
            .end(function (err, res) {
                let msgs = res.body.data;
                let check = false;
                if(msgs){
                    for (let j= 0; j < msgs.length; j++){
                        if(msgs[j].sender == '1'){
                        check = true;
                    }
                    }
                    expect(check).toBe(true);
                    done();
                }
            });
        });
    })


    test('get pending request', (done) =>{
        agent.get(HOST + '/deliverys/pendingRequests?mode=test')
        .end(function (err, res) {
          let msgs = res.body.data;
          let check = true;
          if(msgs){
            for (let j= 0; j < msgs.length; j++){
                if (msgs[j].status != "pending"){
                    check = false;
                    break;
                }
            } 
            }
          expect(check).toBe(true);
          done();
        });
    })

    test('get user request', (done) => {
        agent.post(HOST + '/deliverys/userRequests')
        .send(sampleReq)
        .end(function (err, res) {
            agent.get(HOST + '/deliverys/userRequests?mode=test&username=1')
            .end(function (err, res) {
                let msgs = res.body.data;
                let check = false;
                if(msgs){
                    for (let j= 0; j < msgs.length; j++){
                        if(msgs[j].sender == '1'){
                        check = true;
                    }
                    }
                    expect(check).toBe(true);            
                    done();
                }
            });
        });
    })

    test('get volunteer order', (done) => {
        var volunteerName = "JadeQ";
        agent.get(HOST + '/deliverys/volunteerRequests?mode=test&username=' + volunteerName)
        .end(function (err, res) {
          let msgs = res.body.data;
          let check = true;
          if(msgs){
              for (let j= 0; j < msgs.length; j++){
                if (msgs[j].volunteer != volunteerName){
                    check = false;
                    break;
                }
                }
            expect(check).toBe(true);
            done();      
          }
        });
    })

    test('change request status', (done) => {
        agent.post(HOST + '/deliverys/userRequests')
        .send(sampleReq)
        .end(function (err, res) {
            agent.get(HOST + '/deliverys/userRequests?mode=test&username=1')
            .end(function (err, res) {
                let id = res.body.data[0]._id;
                var body = {
                    "id": id,
                    "status": "Finished"
                }
                 
                agent.post(HOST + '/deliverys/requestStatus')
                .send(body)
                .end(function (err, res) {
                    expect(res.statusCode).toBe(200);
                    done();
                });
            
            });
        });
       
    })

    test('assign volunteer to request', (done)=>{
        agent.post(HOST + '/deliverys/userRequests')
        .send(sampleReq)
        .end(function (err, res) {

            agent.get(HOST + '/deliverys/userRequests?mode=test&username=1')
            .end(function (err, res) {
                let id = res.body.data[0]._id;
                var body = {
                    "id": id,
                    "volunteer": "v1"
                }
                 
                agent.post(HOST + '/deliverys/requestVolunteer')
                .send(body)
                .end(function (err, res) {
                    expect(res.statusCode).toBe(200);
                    done();
                });
            });
        });
    })


    test('get user address', (done)=>{
        var username = "1";
        agent.get(HOST + '/deliverys/userAddress?mode=test&username=' + username)
        .end(function (err, res) {
          let msgs = res.body.data;
          let check = true;
          if(msgs){
              for (let j= 0; j < msgs.length; j++){
                if (msgs[j].username != username){
                    check = false;
                    break;
                }
              }
            expect(check).toBe(true);
            done();      
          }
        });
    });

    test('update user address', (done)=>{
        var body = {
            "username": "1",
            "address": "new address",
            "mode": "test",
            "x": "0",
            "y": "0"
        }
        agent.post(HOST + '/deliverys/userAddress')
        .send(body)
        .end(function (err, res) {
            expect(res.statusCode).toBe(200);
            done();      
        });
    });

    test('update user address', (done)=>{
        var body = {
            "username": "6",
            "address": "new address",
            "mode": "test",
            "x": "0",
            "y": "0"
        }
        agent.post(HOST + '/deliverys/userAddress')
        .send(body)
        .end(function (err, res) {
            expect(res.statusCode).toBe(200);
            done();      
        });
    });

});


