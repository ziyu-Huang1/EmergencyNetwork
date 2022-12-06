'use strict';

var MessageDAO = require('../../DAO/messageDAO')
const Message =require('../../models/Message')

var message1 ={
    content: "Good morning",
    sender:"john",
    receiver:"mary",
    type:"public",
    time:new Date(),
    senderStatus:"undefined",
    ifread:false

}


describe('public message unit tests', function(){

    let messageDAO = new MessageDAO("normal");
    messageDAO = new MessageDAO("measure");

    beforeAll(()=>{
        messageDAO  = new MessageDAO("api");
    });

    afterAll(()=>{

    })

    test('create a public message', async()=>{
        messageDAO.create(message1.content, message1.sender, message1.receiver, message1.type, message1.time, message1.senderStatus, message1.ifread, function (err, addedMessage){
            messageDAO.loadPublicMessage( function (err, foundMessage){
                // expect(foundMessage[foundMessage.length-1][sender]).to.equal("mary");
            })
        })
    })

    test('load public message', async()=>{
        messageDAO.loadPublicMessage( function (err, foundMessage){
            // expect(foundMessage[foundMessage.length-1][sender]).to.equal("mary");
        })
    })

    test('get unread', async()=>{
        messageDAO.getUnreadList("mary").then( function (err, foundMessage){
            // expect(foundMessage[foundMessage.length-1][receiver]).to.equal("mary");
        })
    })

    test('test remove all message from measurePerformanceMessage', async()=>{
        messageDAO.remove(function (err, addedMessage){
            // expect(Message.MeasurePerformanceMessage.find({})).to.equal(null);
        })
    })

});


