var express = require('express');
const Product = require('../models/product');
var router = express.Router();

router.post('/addProduct', function(req, res, next) {
    const productObj = new Product({
        name: req.body.name,
        brand: req.body.brand,
        price: req.body.price
    });
    const result = productObj.save();
    res.json(result);
});

router.get('/getAllProducts', function(req, res, next) {
    Product.find().exec().then((result) => {
        res.json(result);
    }).catch((err) => {
        res.send('Failed to fetch all the products');
    })
})

router.delete('/deleteProduct/:productId', function(req, res, next) {
    const productId = req.params.productId;
    Product.delete({ _id: productId }).then((result) => {
        console.log(result);
        res.send('Successfully deleted ' + productId + 'from DB. Rows Affected: ' + result.deletedCount);
    }).catch((err) => {
        console.log('Failed to delete')
    })
});

router.get('/getProductById/:productId', function(req, res, next) {
    const productId = req.params.productId;
    Product.findById(productId).exec().then((result) => {
        res.json(result)
    }).catch(() => {
        res.send('Could not get the product details')
    })
});

router.put('/updateProductById/:productId', function(req, res, next) {
    const productId = req.params.productId;
    Product.findByIdAndUpdate({ _id: productId }, req.body).exec().then((result) => {
        res.json(result);
    }).catch(() => {
        res.send('Failed to update');
    })
})

module.exports = router;


// USERS (collection) - CRUD
// name
// email
// password
// profilePic (string input / url of the profile pic in string format)
// address

// 1. As a user I should be able to make an account (sign up) (POST- add a user)
// 2. get the details of a user
// 3. update the user
// 4. delete a user
// 5. should be able to  sign in  - if i give correct email & password - response is successful, else send failed sign in
