
const MessageDAO = require('../DAO/messageDAO')


const path = require('path');
class measurePerformanceController{
    
    async measure (req, res) {
        res.sendFile(path.join(__dirname,'..','views','measure.html'));
        
    }

    async startMeasurePerformance(req, res){
        let messageDAO  = new MessageDAO("measure");
        const { duration, interval } = req.body;
        
        console.log("set mode = true, start measureing performance");
        await global.measureTool.reset(); // reset Measure Tool
        // initialize testDB
        messageDAO.remove();
        global.measureMode = true;
        res.json({});
        
    }

    async endMeasure(req, res){
        global.measureMode = false;
        res.json({
            "get":  global.measureTool.getCntGet(), 
            "post": global.measureTool.getCntPost() 
        });
    }


    async returnGoodStatus(req, res){
        console.log("GOOD");
        res.json({});
    }

    async disruptPerformance(req, res){
        global.measureMode = false;
        res.json({});
    }
}

let measure_performance_controller = new measurePerformanceController();


module.exports = {
    measure: measure_performance_controller.measure,
    performance: measure_performance_controller.startMeasurePerformance,
    endMeasure: measure_performance_controller.endMeasure,
    returnGoodStatus: measure_performance_controller.returnGoodStatus,
    disruptPerformance: measure_performance_controller.disruptPerformance
};