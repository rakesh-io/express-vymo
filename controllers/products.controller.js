const Product = require('../models/product.model');

const addProduct = function (req, res, next) {
  const productObj = new Product({
    name: req.body.name,
    brand: req.body.brand,
    price: req.body.price,
  });
  const result = productObj.save();
  res.json(result);
};

const getAllProducts = function (req, res, next) {
  Product.find()
    .exec()
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.send('Failed to fetch all the products');
    });
};

const deleteProduct = function (req, res, next) {
  const productId = req.params.productId;
  Product.delete({ _id: productId })
    .then((result) => {
      console.log(result);
      res.send('Successfully deleted ' + productId + 'from DB. Rows Affected: ' + result.deletedCount);
    })
    .catch((err) => {
      console.log('Failed to delete');
    });
};

const getProductById = function (req, res, next) {
  const productId = req.params.productId;
  Product.findById(productId)
    .exec()
    .then((result) => {
      res.json(result);
    })
    .catch(() => {
      res.send('Could not get the product details');
    });
};

const updateProductById = function (req, res, next) {
  const productId = req.params.productId;
  Product.findByIdAndUpdate({ _id: productId }, req.body)
    .exec()
    .then((result) => {
      res.json(result);
    })
    .catch(() => {
      res.send('Failed to update');
    });
};

module.exports = { addProduct, deleteProduct, getAllProducts, getProductById, updateProductById };
