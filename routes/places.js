const express = require('express');
const { validationResult, body } = require('express-validator');
const createHttpError = require('http-errors');
const router = express.Router();
const mongoose = require('mongoose');
const place = require('../models/place');
const Place = require('../models/place');
const User = require('../models/user');

const createPlaceValidations = [
    body('title').not().isEmpty(),
    body('description').not().isEmpty(),
    body('address').not().isEmpty(),
]

router.get('/getPlaceByPlaceId/:placeId', async function(req, res, next) {
    const placeId = req.params.placeId;
    let place;
    try {
        place = await Place.findById(placeId).exec();
    } catch (err) {
        console.log(err);
        const error = createHttpError('Failed to get the place. Please try later', 500);
        return next(error);
    }

    if (!place) {
        const error = createHttpError('No such place exists with the place ID provided.', 404);
        return next(error);
    }

    res.status(200).json({ place: place.toObject() });
});

router.get('/getPlaceByUserId/:userId', async function(req, res, next) {
    const userId = req.params.userId;
    let existingUser;
    try {
        existingUser = await User.findById(userId).exec();
    } catch (err) {
        console.log(err);
        const error = createHttpError('Failed to get the user. Please try later', 500);
        return next(error);
    }

    console.log(existingUser);

    if (!existingUser) {
        const error = createHttpError('No such user exists with the user ID provided.', 404);
        return next(error);
    }

    let places;
    try {
        places = await Place.find({ creator: userId }).exec()
    } catch (err) {
        console.log(err);
        const error = createHttpError('Failed to get the places. Please try later', 500);
        return next(error);
    }

    if (!places) {
        const error = createHttpError('No places exists with the user ID provided.', 404);
        return next(error);
    }

    res.status(200).json({ places: places.map(place => place.toObject()) });

});

router.post('/createPlace', createPlaceValidations, async function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = createHttpError('Invalid inputs passed, please check your data', 400);
        console.log(validationErrors);
        return next(error);
    }

    const { title, description, image, address, creator } = req.body;

    let existingUser;
    try {
        existingUser = await User.findById(creator).exec();
    } catch (err) {
        console.log(err);
        const error = createHttpError('Failed to get the user. Please try later', 500);
        return next(error);
    }

    if (!existingUser) {
        const error = createHttpError('No such user exists with the user ID provided.', 404);
        return next(error);
    }

    const newPlace = new Place({ title, description, image, address, creator});
    try {
        const session = await mongoose.startSession();
        session.startTransaction();
        await newPlace.save({ session });
        existingUser.places.push(newPlace);
        await existingUser.save({ session });
        await session.commitTransaction();
    } catch (err) {
        console.log(err);
        const error = createHttpError('Creating place failed. Try again later', 500);
        return next(error);
    }

    res.status(201).json({ place: newPlace });

});

router.delete('/deletePlace/:placeId', async function(req, res, next) {
    const placeId = req.params.placeId;

    let place;
    try {
        place = await Place.findById(placeId).populate('creator');
    } catch (err) {
        console.log(err);
        const error = createHttpError('Could not find place. Please try later.', 500);
        return next(error);
    }

    if(!place) {
        const error = createHttpError('The place was not found', 404);
        return next(error);
    }

    try {
        const session = await mongoose.startSession();
        session.startTransaction();
        await place.remove({ session });
        place.creator.places.pull(place);
        await place.creator.save({ session });
        await session.commitTransaction();
    } catch (err) {
        console.log(err);
        const error = createHttpError('Could not delete the place', 500);
        return next(error);
    }

    res.status(200).json({ message: "Deleted the place" });

})

module.exports = router;