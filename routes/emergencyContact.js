var express = require('express');
var router = express.Router();
const emergencyContactController = require("../controller/emergencyContactController");
const path = require('path');

router.get('/:username', function(req,res,next){
    res.sendFile(path.join(__dirname,'..','views','emergencyContact.html'));
});


router.get('/contactLists/:username', function(req,res,next){
    res.sendFile(path.join(__dirname,'..','views','emergencyContactEditView.html'));
})

router.put('/contactLists/:username', emergencyContactController.editContacts);

router.get('/contacts/:username', emergencyContactController.loadContacts);

router.post('/messages', emergencyContactController.sendMsg);



module.exports = router;