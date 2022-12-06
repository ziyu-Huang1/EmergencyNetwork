const { validate } = require('schema-utils');
let agent = require('superagent');

let PORT = 3901;
let HOST = 'http://localhost:' + PORT;

let app = require('../../app');
// console.log("after server");
// const shopEvent = require('../../models/User').ShopEvent;
var server;


describe('shop router' , function() {
    beforeAll(async () => {

        server = await app.listen(PORT);

    })

    beforeEach(() => {

    });

    afterAll(async () => {
        await server.close();
    });

    var se1 ={
        title: "Shop Unit Test",
        description:"This is used for unit testing",
        max: 10,
        min: 2,
        initiator: "molly",
        member: ["please", "winter", "break"],
        status: "in-progress"
    }

    test('can create a shop event', (done) => {
        agent.post(HOST + '/shop')
            .send(se1)
            .end(function (err, res) {
                expect(res.statusCode).toBe(200);

                agent.get(HOST + '/shop/title?title=Shop Unit Test')
                    .send()
                    .end(function (err, res) {
                        // console.log(res.body.eventlst)
                        var event = res.body.eventlst[0]
                        expect(event.title).toBe(se1.title);
                        done();
                    });
            });

    });

    var member = {
        title : "Shop Unit Test",
        newMember : "free"
    }

    test('add a member', (done) => {
        agent.post(HOST + '/shop/member')
            .send(member)
            .end(function (err, res) {
                expect(res.statusCode).toBe(200);
                agent.get(HOST + '/shop/title?title=Shop Unit Test')
                    .send()
                    .end(function (err, res) {
                        // console.log(res.body.eventlst)
                        var event = res.body.eventlst[0]
                        expect(event.member).toContain("free");
                        done();
                    });
            });

    });

    var status = {
        title : "Shop Unit Test",
        newStatus : "test-status"
    }

    test('update status', (done) => {
        agent.post(HOST + '/shop/status')
            .send(status)
            .end(function (err, res) {
                expect(res.statusCode).toBe(200);
                agent.get(HOST + '/shop/title?title=Shop Unit Test')
                    .send()
                    .end(function (err, res) {
                        // console.log(res.body.eventlst)
                        var event = res.body.eventlst[0]
                        expect(event.status).toBe("test-status");
                        done();
                    });
            });

    });

    test('get by initiator', (done) => {
        agent.get(HOST + '/shop/initiator?initiator=molly')
            .send()
            .end(function (err, res) {
                expect(res.statusCode).toBe(200);
                var event = res.body.eventlst[0]
                expect(event.title).toBe(se1.title);
                done();
            });

    });

    test('get by member', (done) => {
        agent.get(HOST + '/shop/member?member=winter')
            .send()
            .end(function (err, res) {
                expect(res.statusCode).toBe(200);
                var event = res.body.eventlst[0]
                expect(event.title).toBe(se1.title);
                done();
            });

    });

    test('get all', (done) => {
        agent.get(HOST + '/shop')
            .send()
            .end(function (err, res) {
                expect(res.statusCode).toBe(200);
                var event = res.body.eventlst[0]
                expect(event.status).toBe("in-progress");
                done();
            });

    });

    var event = {
        title : "Shop Unit Test"
    }

    test('remove event', (done) => {
        agent.delete(HOST + '/shop/title')
            .send(event)
            .end(function (err, res) {
                expect(res.statusCode).toBe(200);
                agent.get(HOST + '/shop/title?title=Shop Unit Test')
                .send()
                .end(function (err, res) {
                    // console.log(res.body.eventlst)
                    var event = res.body.eventlst[0]
                    expect(event.member).not.toContain("free");
                    done();
                });
            });

    });


})