const express = require('express');

const { addProduct, updateProduct, deleteProduct, getProduct, getProducts } = require('../controllers/product');

const router = express.Router();

// POST => /api/products
router.post('/', addProduct);

// GET => /api/products/:id
router.get('/:id', getProduct);

// GET => /api/products
router.get('/', getProducts);
module.exports = router;