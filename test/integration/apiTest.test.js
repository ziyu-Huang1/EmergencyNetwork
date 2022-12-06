// command: set NODE_ENV=dev -> jest --detectOpenHandles apiTest
const { validate } = require('schema-utils');
let agent = require('superagent');
var UserDAO = require('../../DAO/userDAO');

const JwtUtil = require('../../config/JWTController');

let PORT = 3500;
let HOST = 'http://localhost:' + PORT;

// Initiate Server

let app = require('../../simulateServer');
console.log("after server");
const APIUser = require('../../models/User').APIUser;
const APIMessage = require('../../models/Message').APIMessage;
const APIAnnouncement = require('../../models/Announcement').APIAnnouncement;
const APIDonation= require('../../models/Donation').APIDonation;
var server;


describe('user router', function(){
  beforeAll(async () => {
    server = await app.listen(PORT);
    await APIUser.remove();
  })
    
  beforeEach(() => {
 
  });
  
  afterAll(async () => {
    await server.close();
  
    console.log("server closed");
   
  });
  
  // Dummy Users
  var dummy = { username: 'Arthur', password: 'vwy207', status: "HELP" , testing:"true"};
  var goofy = { username: 'Ritvik', password: 'vwy207', status: "OK" , testing:"true"};
  var silly = { username: 'access', password: 'xyz124', status: "OK" ,testing:"true"};
  var folly = { username: 'Jane', password: 'aa', status: "OK" , testing:"true" };
  

  test('can create a new user', (done) => {
    console.log('test1 start');
    agent.post(HOST + '/users')
      .send(goofy)
      .end(function (err, res) {
        agent.get(HOST + '/users')
          .send()
          .end(function (err, res) {
            let users = res.body.users;
            let gfy = null;
            for (let j= 0; j < users.length; j++){
              if (users[j].username == goofy.username){
                gfy = users[j];
              }
            }
            done();
          });
      });
  
  });test
  
  
  
  test('Can put a user', () => {
    return (async () => {
      await agent.put(HOST + '/users&testing=true')
        .send(goofy)
        .then((res, err) => {
        });
    })().catch(e => {
    })
  });
  
  test('can not create a new user if name invalid ', (done) => {
    agent.post(HOST + '/users')
      .send(silly)
      .end(function (err, res) {
        
        expect(res.statusCode).toBe(400);
        done();
      });
  });

  test('can not put a existing user if name invalid ', (done) => {
    agent.put(HOST + '/users')
      .send(silly)
      .end(function (err, res) {
        
        expect(res.statusCode).toBe(400);
        done();
      });
  });

  test('can put a existing user', (done) => {
    var goofy2= { username: 'Ritvik2', password: 'vwy20', status: "OK" , testing:"true"};
    APIUser.create({ username: 'Ritvik2', password: 'vwy20'}).then(()=> {
      agent.put(HOST + '/users')
      .send(goofy2)
      .end(function (err, res) {
        expect(res.statusCode).toBe(200);
        done();

      });

    })

  });

  test('can not put a existing user if password incorrect ', (done) => {
    var goofy2= { username: 'Ritvik1', password: 'vwy20', status: "OK" , testing:"true"};
    APIUser.create({ username: 'Ritvik1', password: 'vwy89'}).then(()=> {
      agent.put(HOST + '/users')
      .send(goofy2)
      .end(function (err, res) {
        expect(res.statusCode).toBe(400);
        done();

      });

    })

  });

  test('can not put a existing user if user do not exist ', (done) => {
    agent.put(HOST + '/users')
      .send(dummy)
      .end(function (err, res) {
        expect(res.statusCode).toBe(404);
        done();

      });
  });

  test('can logout an existing user', (done) => {
    const jwt = new JwtUtil({'username': goofy.username,"password": "123"});
    var token = jwt.generateToken();
    agent.put(HOST + '/users/offline')
      .send(JSON.stringify({goofy:""}))
      .set('token', token)
      .end(function (err, res) {
        expect(res.statusCode).toBe(200);
        done();

      });

  });



  test('Should not be able to post an exsisting user with rigth response code', (done) => {
    APIUser.create({ username: 'Jane', password: 'aa'}).then(()=> {
      agent.post(HOST + '/users')
      .send(folly)
      .end(function (err, res) {
        done();
      });
  });

    })

});


describe('message router' , function() {
  beforeAll(async () => {
    server = await app.listen(PORT);
    await APIMessage.remove();
  })
    
  beforeEach(() => {
    
  });
  
  afterAll(async () => {
    await server.close();
   
  });
  
  test('can post public message', (done) => {
    const publicmessage = { content: 'hello', sender: 'user1', receiver: "" ,type:'public', testing:"true"};
    agent.post(HOST + '/messages/public')
      .send(publicmessage)
      .end(function (err, res) {
            done();
      });

  });

  test('can post private message', (done) => {
    let privateMsg = {message: 'hey', sender: 'user2', receiver: "12341" ,type:'private', testing:"true"};
    agent.post(HOST + '/messages/private')
      .send(privateMsg)
      .end(function (err, res) {
       
        expect(res.statusCode).toBe(201);
        agent.get(HOST + '/messages/private/')
          .send(privateMsg)
          .end(function (err, res) {
            
            let msgs = res.body.msglist;
            let cont = null;
            for (let j= 0; j < msgs.length; j++){
              if (msgs[j].content == privateMsg.message){
                cont = msgs[j].content;
              }
            }
            expect(cont).toBe(privateMsg.message);
            done();
          });
      });
  
  });
  
  test('can post private message', (done) => {
    let privateMsg = {message: 'hey', sender: 'user2', receiver: "12341" ,type:'private', testing:"true"};
    agent.post(HOST + '/messages/private')
      .send(privateMsg)
      .end(function (err, res) {
        
        expect(res.statusCode).toBe(201);
        agent.get(HOST + '/messages/private/sender=user2&receiver=12341&testing=true')
          .send(privateMsg)
          .end(function (err, res) {

            
            let msgs = res.body;
            console.log('sadfsfdsafs', msgs);
            let cont = null;
            for (let j= 0; j < msgs.length; j++){
              if (msgs[j].message == privateMsg.message){
                cont = msgs[j].message;
              }
            }
            done();
          });
      });

  });


})




describe('announcement router' , function() {
  beforeAll(async () => {
    server = await app.listen(PORT);
    await APIAnnouncement.remove();
  })
    
  beforeEach(() => {
    
  });
  
  afterAll(async () => {
    await server.close();
   
  });

  
  test('can post announcement', (done) => {

    let ann = {content:"announcement integration test 11/16 1",
        sender: "testSender",
        time: Date.now(),
        token: "abcdsanjkcasncdjisacnqj",
        testing: "true"};
        agent.post(HOST + '/announcements')
          .send(ann)
          .end(function (err, res) {
              done();
          });
  
  });

  test('can get all announcements', (done) => {

    agent.get(HOST + '/announcements/all?testing=true')
        .send()
       
        .end(function (err, res) {

            done();
        });

  });

    test('can get announcement', (done) => {

        agent.get(HOST + '/announcements/single?testing=true')
            .send()
            
            .end(function (err, res) {
                done();
            });

    });




})


describe('search information' , function() {
  var folly = { username: 'test', password: 'aa', status: "OK" , testing:"true" };
    beforeAll(async () => {
        server = await app.listen(PORT);
        await APIUser.remove();
        await APIUser.create(folly);

    })

    beforeEach(() => {
      

    });

    afterAll(async () => {
        await server.close();
        console.log("server closed");

    });

    test('can search announcement', (done) => {

        agent.get(HOST + '/info/announcement?content=test&limit=10&testing=true')
            .send()
            .end(function (err, res) {
              done();
            });

      
    });


    test('can search user information', (done) => {

        agent.get(HOST + '/info/users?username=test&testing=true')
            .send()
       
            .end(function (err, res) {
                done();
            });

    });

    test('can search public information', (done) => {

        agent.get(HOST + '/info/messages/public?content=123&testing=true')
            .send()
            .end(function (err, res) {
               
                expect(res.statusCode).toBe(200);
                done();
            });

    });

    test('can search private information', (done) => {

        agent.get(HOST + '/info/messages/private?content=123&testing=true')
            .send()
            .end(function (err, res) {
               
                expect(res.statusCode).toBe(200);
                done();
            });

    });

    test('can search user status', (done) => {

        agent.get(HOST + '/info/messages/private?content=status&testing=true')
            .send()
            .end(function (err, res) {
               
                expect(res.statusCode).toBe(200);
                done();
            });

    });

    test('search banned words in private messages', (done) => {

        agent.get(HOST + '/info/messages/private?content=a&testing=true')
            .send()
            .end(function (err, res) {
                
                expect(res.statusCode).toBe(200);
                done();
            });

    });

    test('search banned words in public messages', (done) => {

        agent.get(HOST + '/info/messages/public?content=a&testing=true')
            .send()
            .end(function (err, res) {
                
                expect(res.statusCode).toBe(200);
                done();
            });

    });

    test('search banned words in announcements', (done) => {

        agent.get(HOST + '/info/announcement?content=a&testing=true')
            .send()
            .end(function (err, res) {
                
                expect(res.statusCode).toBe(200);
                done();
            });

    });

})