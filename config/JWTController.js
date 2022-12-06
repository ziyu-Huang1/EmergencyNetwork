const jwt = require('jsonwebtoken');
const config = require('config');
const JWT_SECRET_STRING = config.get('jwtSecret');

class Jwt{
    constructor(data){
        this.data = data;
    }
    
    generateToken(){
        var userId = this.data;
        var token = jwt.sign({
            data: userId,
            exp: Math.floor(Date.now() / 1000) + (60 * 60)
        }, JWT_SECRET_STRING);
        
        return token;
    }

    verifyToken(){
        var token = this.data;;
        
        var res = jwt.verify(token, JWT_SECRET_STRING);
        
        return res;
    }
}

module.exports = Jwt;