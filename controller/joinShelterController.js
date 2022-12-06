const ShelterDAO = require('../DAO/shelterDAO')
const UserDAO = require('../DAO/userDAO')
const url = require("url")

class joinShelterController{

    async joinShelter_post(req, res){
        let shelterDAO = new ShelterDAO('normal')
        if (req.body.testing == 'true'){
            shelterDAO = new ShelterDAO('api')
        }
        // console.log(req.body)
        shelterDAO.create(
            req.body
        ).then((result)=>{
            res.status(201).json({ret: result})
        }).catch(function (err){
            res.status(500).json("server error posting shelter")
        })
    }

    async joinShelter_getAll(req, res){
        var info = url.parse(req.url, true).query;
        let shelterDAO = new ShelterDAO('normal')
        if (info.testing == 'true'){
            shelterDAO = new ShelterDAO('api')
        }
        shelterDAO.getAll().then((result)=>{
            res.status(201).json({ret: result})
        })
    }

    async joinShelter_delete(req, res){
        let shelterDAO = new ShelterDAO('normal')
        let userDAO = new UserDAO('normal')
        if (req.body.testing == 'true'){
            shelterDAO = new ShelterDAO('api')
            userDAO = new UserDAO('api')
        }

        shelterDAO.deleteShelter(req.body.address).then(()=>{
            userDAO.deleteShelter(req.body.address).then((result)=>{
                res.status(201).json({ret: result})
            })
        })
    }

    async joinShelter_join(req, res){
        let shelterDAO = new ShelterDAO('normal')
        let userDAO = new UserDAO('normal')
        if (req.body.testing == 'true'){
            shelterDAO = new ShelterDAO('api')
            userDAO = new UserDAO('api')

        }

        var chk = await userDAO.getShelter(req.body.username)

        // if (chk.length == 0){
        //     return res.status(201).json({ret: ""})
        // }

        if (chk[0].shelter != ""){
            return res.status(201).json({ret: "You can not join two shelter at the same time"})
        }

        var ret = await shelterDAO.checkCapacity(req.body.address)

        if (ret.length == 0){
            return res.status(501).json({ret: "The shelter has been deleted, please find another"})
        }

        if (ret[0].curCapacity < ret[0].maxCapacity){
            shelterDAO.joinShelter(req.body.address, ret[0].curCapacity + 1).then((result)=>{
                userDAO.joinShelter(req.body.username, req.body.address).then((result)=>{
                    res.status(201).json({ret: "join success"})
                })
            })
        }
        else {
            res.status(201).json({ret: "Shelter full, please find another shelter"})
        }
    }

    async joinShelter_leave(req, res){
        let shelterDAO = new ShelterDAO('normal')
        let userDAO = new UserDAO('normal')
        if (req.body.testing == 'true'){
            shelterDAO = new ShelterDAO('api')
            userDAO = new UserDAO('api')
            // return res.status(201).json({ret: ""})
        }

        var ret = await shelterDAO.checkCapacity(req.body.address)
        // console.log(ret)
        if (ret.length == 0){
            return res.status(501).json({ret: "The shelter has been deleted"})
        }

        shelterDAO.leaveShelter(req.body.address, ret[0].curCapacity - 1).then(()=>{
            userDAO.leaveShelter(req.body.username).then((result)=>{
                res.status(201).json({ret: "leave success"})
            })
        })
    }

    async joinShelter_state(req, res){
        var info = url.parse(req.url, true).query;
        let userDAO = new UserDAO('normal')
        if (info.testing == 'true'){
            userDAO = new UserDAO('api')
        }
        userDAO.getShelter(info.username).then((result)=>{
            res.status(201).json({ret: result})
        })
    }

}

let join_shelter_controller = new joinShelterController()

module.exports = {
    joinShelter_post: join_shelter_controller.joinShelter_post,
    joinShelter_getAll: join_shelter_controller.joinShelter_getAll,
    joinShelter_delete: join_shelter_controller.joinShelter_delete,
    joinShelter_join: join_shelter_controller.joinShelter_join,
    joinShelter_leave: join_shelter_controller.joinShelter_leave,
    joinShelter_state: join_shelter_controller.joinShelter_state
}