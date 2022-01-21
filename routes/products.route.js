var express = require('express');
var router = express.Router();
const productsController = require('../controllers/products.controller')

router.get('/getAllProducts', productsController.getAllProducts)
router.get('/getProductById/:productId', productsController.getProductById);
router.put('/updateProductById/:productId', productsController.updateProductById);
router.post('/addProduct', productsController.addProduct);
router.delete('/deleteProduct/:productId', productsController.deleteProduct);

module.exports = router;