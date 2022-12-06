'use strict';

const { testDB } = require('../../config/db');
const DonationDAO = require('../../DAO/donationDAO');
const Donation = require('../../models/Donation');
const DonationRequestDAO = require('../../DAO/donationRequestDAO');
const DonationRequest = require('../../models/DonationRequest');
const apiDonationRequest = require('../../models/DonationRequest').APIDonationRequest;
const apiDonation = require('../../models/Donation').APIDonation;
let app = require('../../simulateServer');

let PORT = 3601;
let HOST = 'http://localhost:' + PORT;

describe('provide donation unit tests', function(){
    
    let donationDAO;
    let donationRequestDAO;

    let donation1 = {
        _id:"id",
        itemName: "shoes",
        description: "donationDescription",
        capacity: "10",
        donor: "donor",
        requestList: [],
        status: "notDone"
    }

    let request1 = {
        _id:"id",
        itemName: "shoes",
        capacity: "10",
        donor: "donor",
        donee: "donee",
        reason: "reason",
        requestNum: "requestNum",
        donationID: "donationID",
        status: "pending",
        time: Date.now(),
        unread:"true"
    }

    beforeAll(async()=>{
        await apiDonation.remove();
        await apiDonationRequest.remove();
        donationDAO  = new DonationDAO("api");
        donationRequestDAO = new DonationRequestDAO("api");

    });

    beforeEach(async()=>{
        await apiDonation.remove();
        await apiDonationRequest.remove();
    })

    afterAll(async()=>{
        await apiDonation.remove();
        await apiDonationRequest.remove();

    })
    test('create a donation', async()=>{
        const newDonation = await donationDAO.create("shoes", "description", "capacity", "donor")
        expect(newDonation.itemName).toEqual("shoes")

    })

    
    test('find the donatioin by ID', async()=>{
        const newDonation = await donationDAO.create("shoes", "description", "capacity", "donor")
        const foundDonation = await donationDAO.findOneByID(newDonation._id)
        expect(foundDonation.itemName).toEqual("shoes")
    })

    test('get all donations', async()=>{
        await donationDAO.create("shoes", "description", "capacity", "donor")
        await donationDAO.create("shirts", "description", "capacity", "donor")
        var list = await donationDAO.getAll()
        expect(list.length).toEqual(2)
    })

    test('addRequest', async()=>{
        const newDonation = await donationDAO.create("shoes", "description", "capacity", "donor")
        var bag ={
            itemName_v: request1.itemName,
            capacity_v: request1.capacity,
            donor_v: request1.donor,
        }

        var bag1 = {
            donee_v : request1.donee,
            requestNum_v: request1.requestNum
        }
        const newRequest = await donationRequestDAO.create(bag, bag1, request1.reason,  newDonation._id)
        await donationDAO.addRequest(newDonation._id, newRequest._id)
        const donation = await donationDAO.findOneByID(newDonation._id)
        expect(donation.requestList).toContainEqual(newRequest._id);
    })

    test('removeRequest', async()=>{
        const newDonation = await donationDAO.create("shoes", "description", "capacity", "donor")

        var bag ={
            itemName_v: request1.itemName,
            capacity_v: "4",
            donor_v: request1.donor,
        }

        var bag1 = {
            donee_v : request1.donee,
            requestNum_v: "3"
        }
        const newRequest = await donationRequestDAO.create(bag, bag1, request1.reason,  newDonation._id)
        await donationDAO.removeRequest(newDonation._id, newRequest._id)
        const donation = await donationDAO.findOneByID(newDonation._id)
        expect(donation.requestList).not.toContainEqual(newRequest._id);
    })

    test('get Unhandled Donation By Donor', async()=>{
        const newDonation = await donationDAO.create("shoes", "description", "capacity", "donor")
        var bag ={
            itemName_v: request1.itemName,
            capacity_v: "4",
            donor_v: request1.donor,
        }

        var bag1 = {
            donee_v : request1.donee,
            requestNum_v: "3"
        }
        const newRequest = await donationRequestDAO.create(bag, bag1, request1.reason,  newDonation._id)

        await donationDAO.addRequest(newDonation._id, newRequest._id)
        const list = await donationDAO.getUnhandledDonationByDonor("donor")
        expect(list[0]._id).toEqual(newDonation._id);
    })

    test('updateCapacity', async()=>{
        const newDonation = await donationDAO.create("shoes", "description", "5", "donor")
        await donationDAO.updateCapacity(newDonation._id, "4")
        const donation = await donationDAO.findOneByID(newDonation._id)
        expect(donation.capacity).toEqual("4")
    })

    test('updateStatus', async()=>{
        const newDonation = await donationDAO.create("shoes", "description", "5", "donor")
        await donationDAO.updateStatus(newDonation._id, "done")
        const donation = await donationDAO.findOneByID(newDonation._id)
        expect(donation.status).toEqual("done")
    })

    test('removeDoantion', async()=>{
        const donation = await donationDAO.create("shoes", "description", "capacity", "donor")
        await donationDAO.create("shirts", "description", "capacity", "donor")
        await donationDAO.removeDonation(donation._id)
        var list = await donationDAO.getAll()
        expect(list.length).toEqual(1)
    })

    test('getAllMyDonation', async()=>{
        await donationDAO.create("shoes", "description", "capacity", "donor")
        await donationDAO.create("shirts", "description", "capacity", "donor")
        var list = await donationDAO.getAllMyDonation("donor")
        expect(list.length).toEqual(2)

    })

    test('change user name', async()=>{
        const newDonation = await donationDAO.create("shoes", "description", "capacity", "donor")
        await donationDAO.changeUsername("donor2", "donor")
        console.log("idddddd: "+newDonation._id)
        const donation = await donationDAO.findOneByID(newDonation._id)
        expect(donation.donor).toEqual("donor2")
    })


})