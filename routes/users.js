var express = require('express');
const { body, validationResult } = require('express-validator');
const createHttpError = require('http-errors');
const User = require('../models/user');
var router = express.Router();

const signUpValidations = [
  body('email').isEmail(),
  body('password').isLength({ min: 8 }),
  body('name').not().isEmpty()
];

router.get('/getUsers', async function(req, res, next) {
  try {
    const results = await User.find({}, '-password').exec();
    res.json(results);
  } catch (err) {
    const error = createHttpError('Fetching the users failed. Please try again later!', 400);
    console.log(err);
    return next(error);
  }
});

router.post('/signup', signUpValidations, async function(req, res, next) {
  const validationErrors = validationResult(req);
  if(!validationErrors.isEmpty()) {
    const error = createHttpError('Invalid inputs passed, please check your data', 400);
    console.log(validationErrors);
    return next(error);
  }

  const { name, email, password, image } = req.body;
  let existingUser;
  try {
    existingUser = await User.find({ email });
  } catch(err) {
    const error = createHttpError('Signup failed. Please try later.', 500);
    console.log(err);
    return next(error);
  }

  if (existingUser.length) {
    const error = createHttpError('User already exists. Please try a different email id', 400);
    return next(error);
  }

  const userObj = new User({ name, email, password, image })

  try {
    await userObj.save();
  } catch (err) {
    const error = createHttpError('Signup failed. Please try later.', 500);
    console.log(err);
    return next(error);
  }
  res.status(201).json({ user: userObj.toObject() });
});

module.exports = router;

// const obj = {
//   name: '',
//   place: '',
//   address: ''
// }

// const name = obj.name;
// const place = obj.place;
// const address = obj.address;

// const { name, place, address } = obj; // destructuring an object

// const obj2 = {
//   name: name,
//   place: place,
//   address: address
// }

// const obj2 = {
//   name,
//   place,
//   address
// }