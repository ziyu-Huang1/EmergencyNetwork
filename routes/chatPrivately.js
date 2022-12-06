var express = require('express');
var router = express.Router();
const chat_privately_controller = require("../controller/chatPrivatelyController");
const path = require('path');

router.get('/', chat_privately_controller.privateChat_get);

router.get('/updateIfread', chat_privately_controller.updateIfread_get);
router.post('/', chat_privately_controller.privateChat_post);
// router.put('/', function(req,res){
//     console.log(res.sender+" "+res.receiver);
// });
router.get('/:username', function(req,res,next){
    res.sendFile(path.join(__dirname,'..','views','privateChatPage.html'));
});



// router.put('/socket', chat_privately_controller.privateChatSocket_get)


module.exports = router;