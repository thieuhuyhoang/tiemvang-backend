const express = require('express');
const supplierRoutes = require('./suppliers');
const productRoutes = require('./products');
const saleRoutes = require('./sales'); // New sale routes

const router = express.Router();

router.use('/suppliers', supplierRoutes);
router.use('/products', productRoutes);
router.use('/sales', saleRoutes); // Use sale routes

  
module.exports = router;
