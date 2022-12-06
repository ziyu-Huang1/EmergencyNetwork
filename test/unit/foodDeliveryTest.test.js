'use strict';

var DeliveryRequestDAO = require('../../DAO/deliveryRequestDAO');
var AddressDAO = require('../../DAO/addressDAO');
var provide_delivery_controller = require('../../controller/provideDeliveryController');
var request_delivery_controller = require('../../controller/requestDeliveryController');
const APIDeliveryRequest = require('../../models/DeliveryRequest').APIDeliveryRequest;
const APIAddress = require('../../models/Address').APIAddress;

var request ={
    description: "Good morning",
    address: "",
    contact: "",
    x: "0",
    y: "0",
    sender:"john",
    volunteer: "",
    time: new Date(),
    status: "pending",
    position: ""
}

describe('food delivery unit tests', function(){

    let deliveryRequestDAO;

    beforeAll(async() => {
       await APIDeliveryRequest.remove();
       await APIAddress.remove();
    });

    beforeEach(()=>{
        deliveryRequestDAO = new DeliveryRequestDAO("api");
    });

    afterEach(()=>{
    });

    afterAll(async()=>{
        await APIDeliveryRequest.remove();   
        await APIAddress.remove();
    })


    // description, sender, volunteer, time, status, postion, address, contact, x, y
    jest.setTimeout(50000) ;
    test('create a new delivery request', async()=>{
        const newReq = await deliveryRequestDAO.create(
            request.description,
            request.sender,
            request.volunteer,
            new Date(),
            request.status,
            request.position,
            request.address,
            request.contact,
            request.x,
            request.y
        );
        expect(newReq.sender).toEqual("john");
    })

    test('delete a delivery request', async()=>{
        const newReq = await deliveryRequestDAO.create(
            request.description,
            request.sender,
            request.volunteer,
            new Date(),
            request.status,
            request.position,
            request.address,
            request.contact,
            request.x,
            request.y
        );

        await deliveryRequestDAO.db.deleteMany({_id: newReq._id});
        var res = await deliveryRequestDAO.getRequestsFromId(newReq._id);
        expect(res.length).toBe(0);
    })


    test('get pending request', async() =>{
        var res = await deliveryRequestDAO.getPendingRequests();
        expect(res.length > 0).toEqual(true);
    })

    test('get user request', async() => {
        var res = await deliveryRequestDAO.getUserRequestList("john");
        expect(res.length > 0).toEqual(true);
    })

    test('get volunteer order', async() => {
        var res = await deliveryRequestDAO.getVolunteerRequestList("");
        expect(res.length > 0).toEqual(true);
    })

    test('change request status', async() => {
        const newReq = await deliveryRequestDAO.create(
            request.description,
            request.sender,
            request.volunteer,
            new Date(),
            request.status,
            request.position,
            request.address,
            request.contact,
            request.x,
            request.y
        );
        await deliveryRequestDAO.updateRequestStatus(newReq._id, "in process");
        var res = await deliveryRequestDAO.getRequestsFromId(newReq._id);
        expect(res.length != 0).toBe(true);
        expect(res[0].status == "in process");
        await deliveryRequestDAO.delete(newReq._id);
    })

    test('assign volunteer to request', async()=>{
        const newReq = await deliveryRequestDAO.create(
            request.description,
            request.sender,
            request.volunteer,
            new Date(),
            request.status,
            request.position,
            request.address,
            request.contact,
            request.x,
            request.y
        );
        await deliveryRequestDAO.assignVolunteerToRequest(newReq._id, "Unknown");
        var res = await deliveryRequestDAO.getRequestsFromId(newReq._id);
        expect(res.length != 0).toBe(true);
        expect(res[0].volunteer == "Unknown");
        await deliveryRequestDAO.delete(newReq._id);
    })

    test('db connection', async()=>{
        var res = await deliveryRequestDAO.checkDb();
        expect(res).toBe(true);
    })
});



describe('address', function(){
    let addressDAO;

    beforeAll(()=>{
        addressDAO = new AddressDAO("api");
    });

    beforeEach(()=>{
    });

    afterEach(()=>{
    });

    afterAll(()=>{
    });

    test('create address info', async()=>{
        addressDAO.deleteAddress("username");
        let res = await addressDAO.create("username", "address", "x", "y");
        expect(res.username).toEqual("username");
        addressDAO.deleteAddress("username");
    })

    test('get address info', async()=>{
        await addressDAO.create('username2', 'address2', 'xx2', 'yy2');
        let res = await addressDAO.getUserAddress("username2");
        expect(res.length != 0).toBe(true);
    })

    test('update address info', async()=>{
        await addressDAO.updateUserAddress('username', 'address', 'xx', 'yy');
        addressDAO.deleteAddress("username");
        let res = await addressDAO.getUserAddress("username");
        expect(res.length).toBe(0); 
    })


    test('db connection', async()=>{
        var res = await addressDAO.checkDb();
        expect(res).toBe(true);
    })
});

