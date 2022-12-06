// command: set NODE_ENV=dev -> jest --detectOpenHandles apiTest
const { validate } = require('schema-utils');
let agent = require('superagent');


let PORT = 4000;
let HOST = 'http://localhost:' + PORT;

// Initiate Server

let app = require('../../simulateServer');

const APIMessage = require('../../models/Message').APIMessage;

var server;

describe('shelter router' , function() {
    beforeAll(async () => {
        await APIMessage.remove();
        server = await app.listen(PORT);

    })

    beforeEach(() => {

    });

    afterAll(async () => {
        await server.close();

    });

    var message1 ={
        content: "Good morning",
        sender:"john",
        receiver:"mary",
        type:"public",
        time:new Date(),
        senderStatus:"undefined",
        ifread:false,
        testing: true
    }

    var user1 ={
        username: "john",
        socket: "123"
    }

    test('can post a new message', (done) => {
        agent.post(HOST + '/messages/public')
            .send(message1)
            .end(function (err, res) {

                expect(res.statusCode).toBe(201);

                done();
            });

    });

    test('can get a new message', (done) => {
        agent.get(HOST + '/messages/public?testing=true')
            .send()
            .end(function (err, res) {

                expect(res.statusCode).toBe(200);

                done();
            });

    });

    test('can get alarm list', (done) => {
        agent.get(HOST + '/messages/public/alarmList?testing=true')
            .send()
            .end(function (err, res) {

                expect(res.statusCode).toBe(200);

                done();
            });

    });

    test('can update socket', (done) => {
        agent.put(HOST + '/messages/public/socketUpdate')
            .send(user1)
            .end(function (err, res) {

                expect(res.statusCode).toBe(200);

                done();
            });

    });

})