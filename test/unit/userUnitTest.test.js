'use strict';

const User = require('../../models/User');

describe('user unit tests', function(){

    let user
    var u1 ={
        username: "unittest1",
        password:"1234",
        online: true,
        status: "undefined"
    }

    beforeAll(()=>{
        user = User.User
    });

    afterAll(()=>{
        
    })

    test('get all users', async()=>{
        user.getAllUsers()
    })

    test('get all active users', async()=>{
        user.getAllActiveUsers()
    })

    test('get user', async()=>{
        user.getUser("unittest1")
    })

    test('set socket id', async()=>{
        user.setSocketID(u1, "1")
    })

    test('get socket id', async()=>{
        user.getSocketID(u1)
    })

});

describe('user unit tests global', function(){
    
    let user
    var u1 ={
        username: "unittest1",
        password:"1234",
        online: true,
        status: "undefined"
    }

    beforeAll(()=>{
        global.measureMode = true
        user = User.User
    });

    afterAll(()=>{
        global.measureMode = false
    })

    test('get all users', async()=>{
        user.getAllUsers()
    })

    test('get all active users', async()=>{
        user.getAllActiveUsers()
    })

    test('get user', async()=>{
        user.getUser("unittest1")
    })

    test('set socket id', async()=>{
        user.setSocketID(u1, "1")
    })

    test('get socket id', async()=>{
        user.getSocketID(u1)
    })


});