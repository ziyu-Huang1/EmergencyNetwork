'use strict';




const ShelterDAO = require('../../DAO/shelterDAO');



var shelter1 ={
    creator: "4321",
    address: "Unit_Test",
    maxCapacity: "2",
    foodProvided: "true",
    medicineProvided: "true"
}



var shelter2 ={
    creator: "4321",
    address: "Unit_Test1",
    maxCapacity: "2",
    foodProvided: "false",
    medicineProvided: "false"
}



describe('join shelter unit tests', function(){


    let shelterDAO;


    beforeAll(()=>{

        shelterDAO  = new ShelterDAO("api");

    });


    afterAll(()=>{

        shelterDAO.deleteShelter(shelter1.address)

    })

    test('post a shelter2', async()=>{

        const newShelter = await shelterDAO.create(shelter2)
        expect(newShelter.address).toEqual("Unit_Test1")
    })

    test('post a shelter', async()=>{

        const newShelter = await shelterDAO.create(shelter1)
        expect(newShelter.address).toEqual("Unit_Test")
    })

    test('get all shelters', async()=>{

        const newShelter = await shelterDAO.getAll()
        expect(newShelter[newShelter.length - 1].address).toEqual("Unit_Test")
    })

    test('check shelter capacity', async()=>{

        const newShelter = await shelterDAO.checkCapacity(shelter1.address)
        expect(newShelter[0].maxCapacity).toEqual(Number(shelter1.maxCapacity))
    })

    test('join a shelter', async()=>{

        shelterDAO.joinShelter(shelter1.address, 1).then(async()=>{
            const newShelter = await shelterDAO.checkCapacity(shelter1.address)
            // expect(newShelter[0].curCapacity).toEqual(1)
        })
    })

    test('leave a shelter', async()=>{

        shelterDAO.leaveShelter(shelter1.address, 0).then(async()=>{
            const newShelter = await shelterDAO.checkCapacity(shelter1.address)
            // expect(newShelter[0].curCapacity).toEqual(0)
        })
    })

    test("change name", async()=>{

        const newShelter = await shelterDAO.changeUsername("4321", "4321")
    })

    test('delete a shelter', async()=>{

        const newShelter = await shelterDAO.deleteShelter(shelter1.address)
        // expect(newShelter.deletedCount).toHaveReturnedTimes(1)
    })







});


