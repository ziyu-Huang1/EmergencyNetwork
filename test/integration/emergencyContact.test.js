// command: set NODE_ENV=dev -> jest --detectOpenHandles apiTest
const { validate } = require('schema-utils');
let agent = require('superagent');
const JwtUtil = require('../../config/JWTController');

let PORT = 3600;
let HOST = 'http://localhost:' + PORT;

// Initiate Server

let app = require('../../app');
const APIUser = require('../../models/User').APIUser;
const APIMessage = require('../../models/Message').APIMessage;
const APIEmergencyContact = require('../../models/EmergencyContatcs').APImergencyContacts;
var server;


describe('emergencyContact router', function(){
    // Dummy Users
    var dummy = { username: 'u1', password: 'vwy207', status: "HELP" , testing:"true"};
    var goofy = { username: 'u2', password: 'vwy207', status: "OK" , testing:"true"};
    var silly = { username: 'u3', password: 'xyz124', status: "OK" ,testing:"true"};
    var folly = { username: 'u4', password: 'aa', status: "OK" , testing:"true" };
    var mary = { username: 'u5', password: 'aa', status: "OK" , testing:"true" };
    
    beforeAll(async () => {
    server = await app.listen(PORT);
      
    
    })
      
    beforeEach(async () => {
      await APIUser.remove();
      await APIEmergencyContact.remove();
      
      await APIUser.create(dummy);
      await APIUser.create(goofy);
      await APIUser.create(silly);
      await APIUser.create(folly);
      await APIUser.create(mary);
   
    });
    
    afterAll(async () => {
      await server.close();
    
      console.log("server closed");
     
    }); 
    
    test('can not add new emergency contact if token invalid ', (done) => {
      const jwt = new JwtUtil({'username': ''});
      var token = jwt.generateToken();
      
      var data = {'username': 'u1', 'contact1': 'u2', "contact2": "", 'contact3': "",testing:"true"};
      agent.put(HOST + '/emergencyContacts/contactLists/u1')
        .send(data)
        .set('token', token)
        .end(function (err, res) {
          expect(res.statusCode).toBe(498);
              done();
           
        });
      });
  
    test('can add 1 new emergency contact', (done) => {
      const jwt = new JwtUtil({'username': 'u1'});
      var token = jwt.generateToken();
      var data = {'username': 'u1', 'contact1': 'u2', "contact2": "", 'contact3': "",testing:"true"};
      agent.put(HOST + '/emergencyContacts/contactLists/u1')
        .send(data)
        .set('token', token)
        .end(function (err, res) {
          expect(res.statusCode).toBe(200);
    
          agent.get(HOST + '/emergencyContacts/contacts/u1')
            .send(data)
            .set('token', token)
            .end(function (err, res) {
              let data = res.body.data;
              expect(data.username).toBe(dummy.username);
              expect(data.contact1).toBe("u2");
              done();
            });
        });
      });
  

      test('can add 3 new emergency contacts', (done) => {
        const jwt = new JwtUtil({'username': 'u1'});
        var token = jwt.generateToken();
        var data = {'username': 'u1', 'contact1': 'u2', "contact2": 'u3', 'contact3': 'u4',testing:"true"};
        agent.put(HOST + '/emergencyContacts/contactLists/u1')
          .send(data)
          .set('token', token)
          .end(function (err, res) {
            expect(res.statusCode).toBe(200);
      
            agent.get(HOST + '/emergencyContacts/contacts/u1')
              .send(data)
              .set('token', token)
              .end(function (err, res) {
                let data = res.body.data;
                expect(data.username).toBe(dummy.username);
                expect(data.contact1).toBe("u2");
                expect(data.contact2).toBe("u3");
                expect(data.contact3).toBe("u4");
                done();
              });
          });
        });
  
  
      test('can update a emergency contact', (done) => {
        const jwt = new JwtUtil({'username': 'u1',"password": "123"});
        var token = jwt.generateToken();
        var data = {'username': 'u1', 'contact1': silly.username, "contact2": "", 'contact3': "",testing:"true"};
        agent.put(HOST + '/emergencyContacts/contactLists/u1')
        .send(data)
        .set('token', token)
        .end(function (err, res) {
          expect(res.statusCode).toBe(200);
            agent.get(HOST + '/emergencyContacts/contacts/u1')
              .send(data)
              .set('token', token)
              .end(function (err, res) {
              let data = res.body.data;
              expect(data.username).toBe(dummy.username);
              expect(data.contact1).toBe(silly.username);
              done();
            });
          });
      });
        
      test('can get a emergency contact', (done) => {
        const jwt = new JwtUtil({'username': 'u1',"password": "123"});
        var token = jwt.generateToken();
        const data = {'username': 'u1', testing:"true"};
        const data1 = {'username': 'u1', 'contact1': silly.username, "contact2": "", 'contact3': ""};

        APIEmergencyContact.create(data1).then(() => {
          agent.get(HOST + '/emergencyContacts/contacts/u1')
          .send(data)
          .set('token', token)
          .end(function (err, res) {
          let data3 = res.body.data;
          expect(data3.username).toBe(dummy.username);
          expect(data3.contact1).toBe(silly.username);
          done();
        });

        })
        
          
      });
  
      
    test('can delete a emergency contact', (done) => {
      const jwt = new JwtUtil({'username': 'u1',"password": "123"});
      var token = jwt.generateToken();
      const data1 = {'username': 'u1', 'contact1': silly.username, "contact2": "", 'contact3': ""};
      APIEmergencyContact.create(data1).then(() => {
        const data = {'username': 'u1', 'contact1': '', "contact2": "", 'contact3': "",testing:"true"};
        agent.put(HOST + '/emergencyContacts/contactLists/u1')
        .send(data)
        .set('token', token)
        .end(function (err, res) {
          expect(res.statusCode).toBe(200);
            agent.get(HOST + '/emergencyContacts/contacts/u1')
              .send(data)
              .set('token', token)
              .end(function (err, res) {
              let data2 = res.body.data;
              expect(data2.username).toBe(dummy.username);
              expect(data2.contact1).toBe("undefined");
              done();
            });
          });

        }
       )

      
      });
  
    test('cannot add unexisting user as emergency contact1', (done) => {
      const jwt = new JwtUtil({'username': 'u1',"password": "123"});
      var token = jwt.generateToken();
      const data = {'username': 'u1', 'contact1': 'unexist', "contact2": "", 'contact3': "",testing:"true"};
        agent.put(HOST + '/emergencyContacts/contactLists/u1')
          .send(data)
          .set('token', token)
          .end(function (err, res) {
          expect(res.statusCode).toBe(404);
          done();
              
          });
      });
  
      test('cannot add unexisting user as emergency contact2', (done) => {
        const jwt = new JwtUtil({'username': 'u1',"password": "123"});
        var token = jwt.generateToken();
        var data = {'username': 'u1', 'contact2': 'unexist', "contact1": "", 'contact3': "",testing:"true"};
        agent.put(HOST + '/emergencyContacts/contactLists/u1')
          .send(data)
          .set('token', token)
          .end(function (err, res) {
          expect(res.statusCode).toBe(404);
          done();
              
          });
      });
  
      test('cannot add unexisting user as emergency contact3', (done) => {
        const jwt = new JwtUtil({'username': 'u1',"password": "123"});
        var token = jwt.generateToken();
        const data = {'username': 'u1', 'contact3': 'unexist', "contact2": "", 'contact1': "",testing:"true"};
        agent.put(HOST + '/emergencyContacts/contactLists/u1')
          .send(data)
          .set('token', token)
          .end(function (err, res) {
          expect(res.statusCode).toBe(404);
          done();
              
          });
      });
  
      test('can send message to all contatcs', (done) => {
        const jwt = new JwtUtil({'username': 'u5',"password": "123"});
        var token = jwt.generateToken();
        const contact = {'username': 'u5', 'contact1': 'u1', "contact2": "u2", 'contact3': "u3", testing:"true"};
        APIEmergencyContact.create(contact);
        const data = {'username': 'u5', 'contact1': 'u1', "contact2": "u2", 'contact3': "u3","message" :"this is emergency contact API test", testing:"true"};
        agent.post(HOST + '/emergencyContacts/messages')
        .send(data)
        .set('token', token)
        .end(function (err, res) {
          expect(res.statusCode).toBe(200);
            // agent.get(HOST + '/emergencyContacts/contacts/u1')
            //   .send(data)
            //   .set('token', 'test')
            //   .end(function (err, res) {
            //   // expect(err).toBe(null);
            //   let data = res.body.data;
            //   expect(data.username).toBe(dummy.username);
            //   expect(data.contact1).toBe("undefined");
              done();
            // });
          });
        });


        test('can not send message if token invalid', (done) => {
          const jwt = new JwtUtil({'username': '',"password": "123"});
          var token = jwt.generateToken();
          const contact = {'username': 'u5', 'contact1': 'u1', "contact2": "u2", 'contact3': "u3", testing:"true"};
          APIEmergencyContact.create(contact);
          const data = {'username': 'u5', 'contact1': 'u1', "contact2": "u2", 'contact3': "u3","message" :"this is emergency contact API test", testing:"true"};
          agent.post(HOST + '/emergencyContacts/messages')
          .send(data)
          .set('token', token)
          .end(function (err, res) {
            expect(res.statusCode).toBe(498);
                done();
              // });
            });
          });
      
        test('send message server error', (done) => {
          const jwt = new JwtUtil({'username': 'Mary',"password": "123"});
          var token = jwt.generateToken();
          APIMessage.create = jest.fn().mockReturnValue(new Error("network error"));
  
          const data = {'username': 'Mary', 'contact1': 'Jan', "contact2": "Access", 'contact3': "Ritvik","message" :"this is emergency contact API test", testing:"true"};
          agent.post(HOST + '/emergencyContacts/messages')
          .send(data)
          .set('token', token)
          .end(function (err, res) {
            // expect(err).toBe(null);
            expect(res.statusCode).toBe(200);
              // agent.get(HOST + '/emergencyContacts/contacts/u1')
              //   .send(data)
              //   .set('token', 'test')
              //   .end(function (err, res) {
              //   // expect(err).toBe(null);
              //   let data = res.body.data;
              //   expect(data.username).toBe(dummy.username);
              //   expect(data.contact1).toBe("undefined");
                done();
              // });
            });
          });
  
  
       
    
    
  });