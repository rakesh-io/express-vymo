var express = require('express');
const { body } = require('express-validator');
const userController = require('../controllers/users.controller');
var router = express.Router();

const signUpValidations = [
  body('email').isEmail(),
  body('password').isLength({ min: 8 }),
  body('name').not().isEmpty()
];

router.get('/getUsers', userController.getUsers);
router.post('/signup', signUpValidations, userController.signUp);
router.post('/signin', userController.signIn);

module.exports = router;