var express = require('express');
var router = express.Router();
const indexController = require('../controllers/index.controller');

router.get('/', indexController.indexFunc);

module.exports = router;
