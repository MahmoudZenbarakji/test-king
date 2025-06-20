const express = require('express');
const router = express.Router();
const productController = require('../Controllers/productController');

router.post('/', productController.createProduct);
router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById); 

module.exports = router;