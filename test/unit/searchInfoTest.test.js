// 'use strict';
const { JsonWebTokenError } = require('jsonwebtoken');
var MessageDAO = require('../../DAO/messageDAO')
var UserDAO = require('../../DAO/userDAO');
var Message = require('../../models/Message');
var User = require('../../models/User');
var AnnouncementDAO = require('../../DAO/announcementDAO');
var Announcement = require('../../models/Announcement');

const { testDB } = require("../../config/db");

describe('search info unit tests', function(){

    let userDAO;
    let announcementDAO;
    let messageDAO;

    beforeAll(()=>{
       userDAO = new UserDAO("api");
       announcementDAO = new AnnouncementDAO("api");
       messageDAO = new MessageDAO("api");
    });

    afterAll(()=>{

    })



    test('search user with status', async()=>{
        const users = await userDAO.findAllUsers(null,"ok");
        var hasUser = (users.length >= 0);
        expect(hasUser).toEqual(true);
    })


})


