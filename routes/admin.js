var express = require('express')
var router = express.Router()
const admin_controller = require('../controller/adminController')

router.get('/', admin_controller.getProfile)
router.put('/',admin_controller.changeProfile)

module.exports = router