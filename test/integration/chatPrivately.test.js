const { validate } = require('schema-utils');
let agent = require('superagent');

let PORT = 3700;
let HOST = 'http://localhost:' + PORT;

let app = require('../../app');
// console.log("after server");
// const shopEvent = require('../../models/User').ShopEvent;
var server;


describe('chat privately router' , function() {
    beforeAll(async () => {

        server = await app.listen(PORT);

    })

    beforeEach(() => {

    });

    afterAll(async () => {
        await server.close();
    });

    var data = {
        'message' :  "111",
        'sender':  "iter",
        'receiver': "iter1", 
        'type': "private",
        'status' : "ok",
        'time' : new Date()
    }

    test('send private msg', (done) => {
        agent.post(HOST + '/messages/private')
            .send(data)
            .end(function (err, res) {
                expect(res.statusCode).toBe(201);
                done()
            });

    });

    test('get all msg', (done) => {
        agent.get(HOST + '/messages/private?sender=iter&receiver=iter1')
            .send()
            .end(function (err, res) {
                expect(res.statusCode).toBe(200);
                //expect(res.body.msglist[0].content).toBe("rrr")
                done()
            });

    });

    var data2 =  {
        'sender': "iter",
        'receiver': "iter1",
    }

    test('update if read', (done) => {
        agent.get(HOST + '/messages/private/updateIfread')
            .send(data2)
            .end(function (err, res) {
                expect(res.statusCode).toBe(200);
                done()
            });

    });


})