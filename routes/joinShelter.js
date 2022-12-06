var express = require('express');
var router = express.Router();
const join_shelter_controller = require('../controller/joinShelterController')

router.post('/', join_shelter_controller.joinShelter_post)

router.get('/', join_shelter_controller.joinShelter_getAll)

router.put('/join', join_shelter_controller.joinShelter_join)

router.put('/leave', join_shelter_controller.joinShelter_leave)

router.delete('/delete', join_shelter_controller.joinShelter_delete)

router.get('/state', join_shelter_controller.joinShelter_state)

module.exports = router