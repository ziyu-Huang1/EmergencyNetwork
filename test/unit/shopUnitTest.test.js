'use strict';

const ShopEventDAO = require('../../DAO/shopEventDAO');

var se1 ={
    title: "Shop Unit Test",
    description:"This is used for unit testing",
    max: 10,
    min: 2,
    initiator: "molly",
    member: ["please", "winter", "break"],
    status: "in-progress"
}

describe('shop unit tests', function(){

    let shopEventDAO;

    beforeAll(()=>{
        shopEventDAO  = new ShopEventDAO();
    });

    afterAll(()=>{

    })

    test('create a shop event', async()=>{
        const se = await shopEventDAO.create(se1.title, se1.description, se1.max, se1.min, se1.initiator, se1.member, se1.status)
        expect(se.title).toEqual("Shop Unit Test")
    })

    test('addMember', async()=>{
        const se = await shopEventDAO.addMember(se1.title, "free")
        expect(se.title).toEqual("Shop Unit Test")
    })

    test('update status', async()=>{
        const se = await shopEventDAO.updateStatus(se1.title, "success")
        expect(se.title).toEqual("Shop Unit Test")
    })

    test('get all shop event', async()=>{
        const se = await shopEventDAO.getAll()
        expect(se[0].title).toEqual(se1.title)
    })

    test('get by title', async()=>{
        const se = await shopEventDAO.getByTitle(se1.title)
        expect(se[0].title).toEqual(se1.title)
    })

    test('get by initiator', async()=>{
        const se = await shopEventDAO.getByInitiator(se1.initiator)
        expect(se[0].title).toEqual(se1.title)
    })

    test('get by member', async()=>{
        const se = await shopEventDAO.getByMember("please")
        expect(se[0].title).toEqual(se1.title)
    })

    test('remove a shop event', async()=>{
        const rem = await shopEventDAO.removeEvent(se1.title)
        expect(rem.deletedCount).toEqual(1)
    })

});