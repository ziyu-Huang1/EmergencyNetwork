const ShopEventDAO = require('../DAO/shopEventDAO');

class shopController{
    async addEvent(req, res){
        const title = req.body.title
        const description = req.body.description
        const min = req.body.min
        const max = req.body.max
        const initiator = req.body.initiator
        const member = req.body.member
        const status = req.body.status
        new ShopEventDAO().create(title, description, max, min, initiator, member,status);
        return res.status(200).json("");
    }

    async addMember(req, res){
        const title = req.body.title
        const newMember = req.body.newMember
        await new ShopEventDAO().addMember(title, newMember);
        return res.status(200).json("");
    }

    async updateStatus(req, res){
        const title = req.body.title
        const newStatus = req.body.newStatus
        await new ShopEventDAO().updateStatus(title, newStatus);
        return res.status(200).json("");
    }

    async getAll(req, res){
        new ShopEventDAO().getAll().then((result)=>{
            res.status(200).json({eventlst: result});
        })
    }

    async getByTitle(req, res){
        new ShopEventDAO().getByTitle(req.query.title).then((result)=>{
            res.status(200).json({eventlst: result});
        })
    }

    async getByInitiator(req, res){
        console.log(req.query.initiator)
        new ShopEventDAO().getByInitiator(req.query.initiator).then((result)=>{
            res.status(200).json({eventlst: result});
        })
    }

    async getByMember(req, res){
        console.log(req.query.member)
        new ShopEventDAO().getByMember(req.query.member).then((result)=>{
            res.status(200).json({eventlst: result});
        })
    }

    async removeEvent(req, res){
        const title = req.body.title
        await new ShopEventDAO().removeEvent(title);
        return res.status(200).json("");
    }
}

let sc = new shopController();

module.exports = {
    shopAddEvent: sc.addEvent,
    shopAddMember: sc.addMember,
    shopUpdateStatus: sc.updateStatus,
    shopGetAll:sc.getAll,
    shopGetByTitle: sc.getByTitle,
    shopGetByInitiator: sc.getByInitiator,
    shopGetByMember: sc.getByMember,
    shopRemoveEvent: sc.removeEvent
};