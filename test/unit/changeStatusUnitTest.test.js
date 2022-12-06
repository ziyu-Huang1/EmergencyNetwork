// // 'use strict';



'use strict';

const UserDAO = require('../../DAO/userDAO');
const User = require('../../models/User');
const apiUser = require('../../models/User').APIUser;
var user1 ={
    username: "Unit Test",
    password:"Unit_Test"

}

describe('user unit tests', function(){

    let userDAO = new UserDAO("measure");

    beforeAll(async()=>{
        await apiUser.remove();
        userDAO  = new UserDAO("api");
    });

    afterAll(()=>{

    })







    var user1 ={
        username: "Unit Test",
        password:"Unit_Test"

    }

    describe('user unit tests', function(){

        let userDAO;

        beforeAll(()=>{
            userDAO  = new UserDAO("api");
        });

        afterAll(()=>{

        })

        test('create a newUser', async()=>{
            const newUser = await userDAO.create(user1.username, user1.password,)
            // expect(newUser.username).toEqual("Unit Test")
        })

    });


});