'use strict';

const { testDB } = require('../../config/db');
const DonationRequestDAO = require('../../DAO/donationRequestDAO');
const DonationRequest = require('../../models/DonationRequest');
const DonationDAO = require('../../DAO/donationDAO');
const Donation = require('../../models/Donation');

describe('provide donation unit tests', function(){
    
    let donationRequestDAO;
    let donationDAO;

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

    beforeAll(()=>{
        donationDAO  = new DonationDAO("api");
        donationRequestDAO = new DonationRequestDAO("api");

    });

    afterAll(()=>{

    })
    test('create a donationRequest', async()=>{
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
        donation1._id = newDonation._id
        request1.donationID = newDonation._id
        request1._id = newRequest._id
        expect(newRequest.itemName).toEqual("shoes")
    })


    test('get one request by ID', async()=>{
        const getRequest = await donationRequestDAO.findOneByID(request1._id)
        expect(getRequest.itemName).toEqual("shoes")
    })

    test('getAllMyRequest', async()=>{
        const myRequests = await donationRequestDAO.getAllMyRequest("donee")
        expect(myRequests[0].itemName).toEqual("shoes")
        
    })

    test('get all requests belonging to one donation by donationID ', async()=>{
        const myRequests = await donationRequestDAO.getAllOtherRequestByID(donation1._id)
        expect(myRequests[0].itemName).toEqual("shoes")
    })

    test('updateCapacity', async()=>{
        const result = await donationRequestDAO.updateCapacity(request1._id, "5")

        const getRequest = await donationRequestDAO.findOneByID(request1._id)
        expect(getRequest.capacity).toEqual("5")
    })

    test('getUnreadReply', async()=>{
        const result = await donationRequestDAO.getUnreadReply("donee")
        expect(result[0].itemName).toEqual("shoes")

    })

    test('updateReadStatus',async()=>{
        const result = await donationRequestDAO.updateReadStatus(request1._id,"true")

        const getRequest = await donationRequestDAO.findOneByID(request1._id)
        expect(getRequest.unread).toEqual("true")
    })

    test('updateOneOtherRequestStatus from pending', async()=>{
        const result = await donationRequestDAO.updateOneOtherRequestStatus(request1._id, "Accepted")

        const getRequest = await donationRequestDAO.findOneByID(request1._id)
        expect(getRequest.status).toEqual("Accepted")
    })

    test('updateOneOtherRequestStatus not from pending', async()=>{
        const result = await donationRequestDAO.updateOneOtherRequestStatus(request1._id, "Rejected")

        const getRequest = await donationRequestDAO.findOneByID(request1._id)
        // expect(getRequest.status).toEqual("Accepted")
    })



    test('change donor name', async()=>{
        const result = await donationRequestDAO.changeDonorUsername("Donor", "donor")
        var res = result.acknowledged == true
        expect(res).toEqual(true)
    })

    test('change donee name', async()=>{
        const result = await donationRequestDAO.changeDoneeUsername("Donee", "donee")
        var res = result.acknowledged == true
        expect(res).toEqual(true)
    })


    test('delete many', async()=>{
        const result = await donationRequestDAO.deleteMany()
    })

})