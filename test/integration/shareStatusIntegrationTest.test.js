'use strict';

var DeliveryRequestDAO = require('../../DAO/deliveryRequestDAO');
const { validate } = require('schema-utils');

let agent = require('superagent');
// let app = require('../../server');
let app = require('../../simulateServer');
const { JsonWebTokenError } = require('jsonwebtoken');
const UserDAO = require('../../DAO/userDAO');
const APIUser = require('../../models/User').APIUser;
var server;


let PORT = 3601;
let HOST = 'http://localhost:' + PORT;


describe('share status integration tests', function(){
    let userDAO;
    var goofy = { username: 'Ritvikk', password: 'vwy207', status: "OK" , testing:"true"};
    var sampleReq =
    {
            'username': "Ritvikk",
            'time': new Date(),
            'status': "OK",
            "mode": "test"
    };

    beforeAll( async ()=>{
        server = await app.listen(PORT);
        await APIUser.remove();
        userDAO = new UserDAO("api");
    });

    beforeEach(async ()=>{
        await APIUser.remove();
    });

    afterEach(()=>{
    });

    afterAll(async()=>{
        await server.close();
    })

    test('share status', (done)=>{

        userDAO.create("Ritvikk", "1234");
    
            agent.post(HOST + '/status')
            .send(sampleReq)
            .end(function (err, res) {
                expect(res.statusCode).toBe(200);
                done();
            });

        // agent.get(HOST + '/users')
        //   .send()
        //   .end(function (err, res) {
        //     // expect(err).toBe(null);
        //     let users = res.body.users;
        //     let gfy = null;
        //     for (let j= 0; j < users.length; j++){
        //       // console.log(users, users[j].username, users[j].username == goofy.username);
        //       if (users[j].username == goofy.username){
        //         gfy = users[j];
        //       }
        //     }
        //     expect(gfy.username).toBe(goofy.username);
        //     done();
        //   });
      });
  


});

