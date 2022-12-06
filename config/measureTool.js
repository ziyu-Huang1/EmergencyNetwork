const config = require('config');
class MeasureTool{
    cntGet = 0;
    cntPost = 0;
    constructor(){
        this.cntGet = 0;
        this.cntPost = 0;
    }
    
    getCntGet(){
        return this.cntGet;
    }

    incrementCntGet(){
        this.cntGet += 1;
    }

    getCntPost(){
        return this.cntPost;
    };

    incrementCntPost(){
        this.cntPost += 1;
        
    }
    
    reset(){
        this.cntGet = 0;
        this.cntPost = 0;
    }
    
    
}



module.exports = MeasureTool;