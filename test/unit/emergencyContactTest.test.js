'use strict';

const EmergenncyContactDAO = require('../../DAO/emergencyContactDAO');
const emergencyContacts = require('../../models/EmergencyContatcs');


describe('Emergency Contacts unit test', function(){

    let dao;

    beforeAll(async ()=>{
        dao  = new EmergenncyContactDAO("normal");
        dao.db = emergencyContacts.UnitEmergencyContacts;

        
    });

    afterAll(()=>{

    })

    test('can create a single emergency contact', async()=>{
        var data1 = {'username': 'user1', 'contact1': 'Ritvik', "contact2": "", 'contact3': ""};
        emergencyContacts.UnitEmergencyContacts.create = jest.fn().mockReturnValue(data1);
        const contact = await dao.createContact(data1.username, data1.contact1, data1.contact2, data1.contact3)
        expect(contact.username).toEqual(data1.username);
        expect(contact.contact1).toEqual(data1.contact1);
        expect(contact.contact2).toEqual(data1.contact2);
        expect(contact.contact3).toEqual(data1.contact3);
    })


    test('can create 2  emergency contacts', async()=>{
        var data1 = {'username': 'user1', 'contact1': 'Ritvik', "contact2": "abc", 'contact3': ""};
        emergencyContacts.UnitEmergencyContacts.create = jest.fn().mockReturnValue(data1);
        const contact = await dao.createContact(data1.username, data1.contact1, data1.contact2, data1.contact3)
        expect(contact.username).toEqual(data1.username);
        expect(contact.contact1).toEqual(data1.contact1);
        expect(contact.contact2).toEqual(data1.contact2);
        expect(contact.contact3).toEqual(data1.contact3);
    })

    test('can create 3  emergency contact3', async()=>{
        var data1 = {'username': 'user1', 'contact1': 'Ritvik', "contact2": "abc", 'contact3': "aaa"};
        emergencyContacts.UnitEmergencyContacts.create = jest.fn().mockReturnValue(data1);
        const contact = await dao.createContact(data1.username, data1.contact1, data1.contact2, data1.contact3)
        expect(contact.username).toEqual(data1.username);
        expect(contact.contact1).toEqual(data1.contact1);
        expect(contact.contact2).toEqual(data1.contact2);
        expect(contact.contact3).toEqual(data1.contact3);
    })

    test('if contact information are all undefiend, no record should be created', async()=>{
        var data1 = {'username': 'user1', 'contact1': 'undefined', "contact2": "undefined", 'contact3': "undefined"};
        emergencyContacts.UnitEmergencyContacts.create = jest.fn().mockReturnValue(data1);
        const contact = await dao.createContact(data1.username, data1.contact1, data1.contact2, data1.contact3)
        expect(contact.username).toEqual(data1.username);
        expect(contact.contact1).toEqual(data1.contact1);
        expect(contact.contact2).toEqual(data1.contact2);
        expect(contact.contact3).toEqual(data1.contact3);
    })

    test('can find a contact', async()=>{
        var data1 = {'username': 'user1', 'contact1': 'abc', "contact2": "undefined", 'contact3': "undefined"};
        emergencyContacts.UnitEmergencyContacts.findOne = jest.fn().mockReturnValue(data1);
        const contact = await dao.findContacts(data1.username)
        expect(contact.username).toEqual(data1.username);
        expect(contact.contact1).toEqual(data1.contact1);
        expect(contact.contact2).toEqual(data1.contact2);
        expect(contact.contact3).toEqual(data1.contact3);
    })


    test('can edit a contact', async()=>{
        var data1 = {'username': 'user1', 'contact1': 'abc', "contact2": "undefined", 'contact3': "undefined"};
        emergencyContacts.UnitEmergencyContacts.updateOne = jest.fn().mockReturnValue(data1);
        const contact = await dao.editContact(data1.username, data1.contact1, data1.contact2, data1.contact3)
        expect(contact.username).toEqual(data1.username);
        expect(contact.contact1).toEqual(data1.contact1);
        expect(contact.contact2).toEqual(data1.contact2);
        expect(contact.contact3).toEqual(data1.contact3);
    })



    const message = require('../../models/Message').Message;

    describe('test message', function(){

        beforeAll(()=>{
        
        });


        afterAll(()=>{

        })

        test('getUnreadList', async()=>{
            const res = await message.getUnreadList('receiver');
        })
        
        test('findMessage', async()=>{
            const res = await message.findMessages('receiver', 10, "s", "r");
        })
    });


});




