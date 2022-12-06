// command: set NODE_ENV=dev -> jest --detectOpenHandles apiTest
const { validate } = require('schema-utils');
let agent = require('superagent');


let PORT = 3900;
let HOST = 'http://localhost:' + PORT;

// Initiate Server

let app = require('../../simulateServer');

const APIUser = require('../../models/User').APIUser;

const APIShelter = require('../../models/Shelter').APIShelter;

var server;



describe('shelter router' , function() {
    beforeAll(async () => {
        await APIShelter.remove();
        await APIUser.remove();
        server = await app.listen(PORT);

    })

    beforeEach(() => {

    });

    afterAll(async () => {
        await server.close();

    });

    var user = { username: '4321', password: '4321', status: "OK" , testing:"true" };

    var user1 = { username: '43210', password: '43210', status: "OK" , testing:"true" };

    test('can create a new user', (done) => {
        agent.post(HOST + '/users')
            .send(user)
            .end(function (err, res) {
                

                agent.get(HOST + '/users')
                    .send()
                    .end(function (err, res) {
                        let users = res.body.users;
                        let gfy = null;
                        for (let j= 0; j < users.length; j++){
                            if (users[j].username == user.username){
                                gfy = users[j];
                            }
                        }
                        done();
                    });
            });

    });

    test('can create more new user', (done) => {
        agent.post(HOST + '/users')
            .send(user1)
            .end(function (err, res) {


                agent.get(HOST + '/users')
                    .send()
                    .end(function (err, res) {
                        let users = res.body.users;
                        let gfy = null;
                        for (let j= 0; j < users.length; j++){
                            if (users[j].username == user.username){
                                gfy = users[j];
                            }
                        }
                        done();
                    });
            });

    });

    test('can post shelter', (done) => {

        let shelter1 ={
            creator: "4321",
            address: "123 St",
            maxCapacity: "1",
            foodProvided: "true",
            medicineProvided: "true",
            testing: "true"
        }
        agent.post(HOST + '/shelters')
            .send(shelter1)
            .end(function (err, res) {
                expect(res.status).toBe(201);
                done();
            });

    });


    test('post a wrong shelter', (done) => {

        let shelter1 ={
            testing: "true"
        }
        agent.post(HOST + '/shelters')
            .send(shelter1)
            .end(function (err, res) {
                expect(res.status).toBe(500);
                done();
            });

    });


    test('can get all shelters', (done) => {

        agent.get(HOST + '/shelters/?testing=true&username=4321')
            .send()
            .end(function (err, res) {
                expect(res.statusCode).toBe(201);
                done();
            });

    });

    test('can get state', (done) => {

        agent.get(HOST + '/shelters/state/?testing=true')
            .send()
            .end(function (err, res) {
                expect(res.statusCode).toBe(201);
                done();
            });

    });

    test('can join a shelter', (done) => {

        let body ={
            username: "4321",
            address: "123 St",
            testing: "true"
        }
        agent.put(HOST + '/shelters/join')
            .send(body)
            .end(function (err, res) {
                expect(res.status).toBe(201);
                done();
            });

    });

    test('can not join a shelter', (done) => {

        let body ={
            username: "43210",
            address: "123 St",
            testing: "true"
        }
        agent.put(HOST + '/shelters/join')
            .send(body)
            .end(function (err, res) {
                expect(res.status).toBe(201);
                done();
            });

    });

    test('can not join two shelter at the same time', (done) => {

        let body ={
            username: "4321",
            address: "123 St",
            testing: "true"
        }
        agent.put(HOST + '/shelters/join')
            .send(body)
            .end(function (err, res) {
                expect(res.status).toBe(201);
                done();
            });

    });

    test('can leave a shelter', (done) => {

        let body ={
            username: "4321",
            address: "123 St",
            testing: "true"
        }
        agent.put(HOST + '/shelters/leave')
            .send(body)
            .end(function (err, res) {
                expect(res.status).toBe(201);
                done();
            });

    });



    test('can delete a shelter', (done) => {

        let body ={
            username: "4321",
            address: "123 St",
            testing: "true"
        }
        agent.delete(HOST + '/shelters/delete')
            .send(body)
            .end(function (err, res) {
                expect(res.status).toBe(201);
                done();
            });

    });

    test('leave a shelter error', (done) => {

        let body ={
            username: " ",
            address: "123 St",
            testing: "true"
        }
        agent.put(HOST + '/shelters/leave')
            .send(body)
            .end(function (err, res) {
                expect(res.status).toBe(501);
                done();
            });

    });

    test('error join a shelter', (done) => {

        let body ={
            username: "4321",
            address: "123 St",
            testing: "true"
        }
        agent.put(HOST + '/shelters/join')
            .send(body)
            .end(function (err, res) {
                expect(res.status).toBe(501);
                done();
            });
    });

})