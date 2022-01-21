const { validationResult } = require('express-validator');
const createHttpError = require('http-errors');
const mongoose = require('mongoose');
const Place = require('../models/place');
const User = require('../models/user');
const errorHandler = require('../utils/handleError');

const getPlaceByPlaceId = async function (req, res, next) {
  const placeId = req.params.placeId;
  let place;
  try {
    place = await Place.findById(placeId).exec();
  } catch (err) {
    errorHandler.handleServerError(err, next, 'user', 'get');
  }

  if (!place) {
    const error = createHttpError('No such place exists with the place ID provided.', 404);
    return next(error);
  }

  res.status(200).json({ place: place.toObject() });
};

const getPlaceByUserId = async function (req, res, next) {
  const userId = req.params.userId;
  let existingUser;
  try {
    existingUser = await User.findById(userId).exec();
  } catch (err) {
    errorHandler.handleServerError(err, next, 'user', 'get');
  }

  console.log(existingUser);

  if (!existingUser) {
    const error = createHttpError('No such user exists with the user ID provided.', 404);
    return next(error);
  }

  let places;
  try {
    places = await Place.find({ creator: userId }).exec();
  } catch (err) {
    errorHandler.handleServerError(err, next, 'places', 'get');
  }

  if (!places) {
    const error = createHttpError('No places exists with the user ID provided.', 404);
    return next(error);
  }

  res.status(200).json({ places: places.map((place) => place.toObject()) });
};

const createPlace = async function (req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    errorHandler.handleValidationError(errors, next);
  }

  const { title, description, image, address, creator } = req.body;

  let existingUser;
  try {
    existingUser = await User.findById(creator).exec();
  } catch (err) {
    errorHandler.handleServerError(err, next, 'user', 'get');
  }

  if (!existingUser) {
    const error = createHttpError('No such user exists with the user ID provided.', 404);
    return next(error);
  }

  const newPlace = new Place({ title, description, image, address, creator });
  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    await newPlace.save({ session });
    existingUser.places.push(newPlace);
    await existingUser.save({ session });
    await session.commitTransaction();
    session.endSession();
  } catch (err) {
    errorHandler.handleServerError(err, next, 'places', 'create');

    res.status(201).json({ place: newPlace });
  }
};

const deletePlace = async function (req, res, next) {
  const placeId = req.params.placeId;

  let place;
  try {
    place = await Place.findById(placeId).populate('creator');
  } catch (err) {
    errorHandler.handleServerError(err, next, 'place', 'get');
  }

  if (!place) {
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
    errorHandler.handleServerError(err, next, 'place', 'delete');
  }

  res.status(200).json({ message: 'Deleted the place' });
};

const updatePlace = async (req, res, next) => {
  const { title, description } = req.body;
  const placeId = req.params.placeId;
  let place;
  try {
    place = await Place.findByIdAndUpdate(placeId, { title, description });
  } catch (err) {
    errorHandler.handleServerError(err, next, 'place', 'update');
  }
  res.status(200).json({ message: 'updated successfully' });
};

module.exports = { getPlaceByPlaceId, getPlaceByUserId, createPlace, deletePlace, updatePlace };
