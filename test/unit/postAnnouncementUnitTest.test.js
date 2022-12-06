'use strict';

const AnnouncementDAO = require('../../DAO/announcementDAO');
const Announcement = require('../../models/Announcement');

var announcement1 ={
    content: "Announcement Unit Test",
    sender:"Unit_Test",
    time:new Date(),
}

describe('post announcement unit tests', function(){

    let announcementDAO;

    beforeAll(()=>{
        announcementDAO  = new AnnouncementDAO("api");
    });

    afterAll(()=>{

    })

    test('create a announcement', async()=>{
        const newannouncement = await announcementDAO.create(announcement1.content, announcement1.sender, announcement1.time)
        expect(newannouncement.sender).toEqual("Unit_Test")
    })

    test('get a announcement', async()=>{
        const newannouncement = await announcementDAO.getLatest()
        expect(newannouncement[0].sender).toEqual("Unit_Test")
    })

    test('get all announcements', async()=>{
        const newannouncement = await announcementDAO.getAll()
        expect(newannouncement[newannouncement.length-1].sender).toEqual("Unit_Test")
    })

    test('find announcements', async()=>{
        const newannouncement = await announcementDAO.findAnnouncement("Announcement Unit Test", "1")
        expect(newannouncement[0].sender).toEqual("Unit_Test")
    })

    test('find null announcements', async()=>{
        const newannouncement = await announcementDAO.findAnnouncement("", "1")
        expect(newannouncement).toEqual(null)
    })

    test('change username', async()=>{
        await announcementDAO.changeUsername("new_test", "Unit_Test")
        const newannouncement = await announcementDAO.findAnnouncement("Announcement Unit Test", "1")
        expect(newannouncement[0].sender).toEqual("new_test")
    })

});


