var express = require('express');
const { body, validationResult } = require('express-validator');
const createHttpError = require('http-errors');
const md5 = require('md5');
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
    res.status(200).json(results);
  } catch (err) {
    const error = createHttpError('Fetching the users failed. Please try again later!', 500);
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

  const { name, email, image } = req.body;
  const password = md5(req.body.password);
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
router.post('/signin', async (req, res, next) => {
  const { email, password } = req.body;
  const md5EncrytedReqPass = md5(password); // sha256, sha512
  let existingUser;
  try {
    existingUser = await User.findOne({ email }).exec();
  } catch (err) {
    console.log(err);
    const error = createHttpError('Something went wrong please try later', 500);
    return next(error);
  }

  if (existingUser.password !== md5EncrytedReqPass) {
    const error = createHttpError("Incorrect Email or Password.", 403);
    return next(error)
  }

  res.status(200).json({ message: "Sign in successful!"});

})

module.exports = router;

// 1. Add a todo item -> should go into pending state automatically (or take a param for initial state).
// 2. I should be able to move a todo from pending to either inprogress or completed state.
// 3. I should be able to move a todo from inprogress to either pending or completed state.
// 4. I should be able to move a todo from completed to either pending or inprogress state.
// 5. I should be able to delete a todo.