class DAO {

    constructor() {

    }
    static set db(_db) {
        _DB = _db;
    }

    static get db() {
        return _DB;
    }

    static async createUser(username, password){ 
        return await this.db.create(
            username,
            password,
            true,
            "undefined",
        )
    }

    static async changeStatus(usernamedata, newStatusdata, timestampdata){
        return await this.db.updateOne({username:usernamedata},{status:newStatusdata, statusUpdateTime: timestampdata});
    }

    static async getAllUsers(){
        return await this.db.getAllUsers();
    }

    static async updateOnlineStatus(usernamedata, onlinedata){
        return await this.db.updateOne({username: usernamedata},{online: onlinedata})
    }

    static async findUser(username){
        return await this.db.findOne({username});
    }

    static async findAllUsers(pattern, status){ 
        return await this.db.findAllUsers(pattern, status);
    }

}

exports.DAO = DAO;