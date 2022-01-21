const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const placesController = require('../controllers/places.controller');

const createPlaceValidations = [
    body('title').not().isEmpty(),
    body('description').not().isEmpty(),
    body('address').not().isEmpty(),
];

router.get('/getPlaceByPlaceId/:placeId', placesController.getPlaceByPlaceId);
router.get('/getPlaceByUserId/:userId', placesController.getPlaceByUserId);
router.put('/updatePlace/:placeId', placesController.updatePlace);
router.post('/createPlace', createPlaceValidations, placesController.createPlace);
router.delete('/deletePlace/:placeId', placesController.deletePlace)

module.exports = router;