// routes/index.js
const express = require('express');
const salesRoutes = require('./sales');
const productsRoutes = require('./products');
const suppliersRoutes = require('./suppliers');

const router = express.Router();

router.use('/sales', salesRoutes);
router.use('/products', productsRoutes);
router.use('/suppliers', suppliersRoutes);

module.exports = router;
