var express = require('express');
const { validationResult } = require('express-validator');
const createHttpError = require('http-errors');
const md5 = require('md5');
const User = require('../models/user.model');
const errorHandler = require('../utils/handleError');

const getUsers = async function(req, res, next) {
    try {
      const results = await User.find({}, '-password').exec();
      res.status(200).json(results);
    } catch (err) {
      errorHandler.handleServerError(err, next, 'user', 'get');
    }
};

const signUp = async function(req, res, next) {
    const validationErrors = validationResult(req);
    if(!validationErrors.isEmpty()) {
      errorHandler.handleValidationError(validationErrors, next);
    }
  
    const { name, email, image } = req.body;
    const password = md5(req.body.password);
    let existingUser;
    try {
      existingUser = await User.find({ email });
    } catch(err) {
      errorHandler.handleServerError(err, next, 'user', 'get');
    }
  
    if (existingUser.length) {
      const error = createHttpError('User already exists. Please try a different email id', 400);
      return next(error);
    }
  
    const userObj = new User({ name, email, password, image })
  
    try {
      await userObj.save();
    } catch (err) {
      errorHandler.handleServerError(err, next, 'user', 'create');
    }
    res.status(201).json({ user: userObj.toObject() });
}

const signIn = async (req, res, next) => {
    const { email, password } = req.body;
    const md5EncrytedReqPass = md5(password); // sha256, sha512
    let existingUser;
    try {
      existingUser = await User.findOne({ email }).exec();
    } catch (err) {
      errorHandler.handleServerError(err, next, 'user', 'get');
    }
  
    if (existingUser.password !== md5EncrytedReqPass) {
      const error = createHttpError("Incorrect Email or Password.", 403);
      return next(error)
    }
  
    res.status(200).json({ message: "Sign in successful!"});
  
};

module.exports = { getUsers, signUp, signIn };