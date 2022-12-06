//basic variable
const express = require('express');
const router = express.Router();
// const config = require('config');
// const path = require('path');
// const { readdirSync } = require('fs');
// const { nextTick } = require('process');
// const bannedList = require('../public/const/bannedName');
// const errorText = require('../public/const/errorText');
var measurePerformanceController = require('../controller/measurePerformanceController.js');


router.put('/', measurePerformanceController.measure);
router.get('/', measurePerformanceController.measure);
router.post('/performance', measurePerformanceController.performance);
router.put('/measureEnd', measurePerformanceController.endMeasure);
router.get('/performance/getRequest', measurePerformanceController.returnGoodStatus);
router.put('/measureDisrupted', measurePerformanceController.disruptPerformance);

module.exports = router;