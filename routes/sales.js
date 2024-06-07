const express = require('express');
const Sale = require('../models/Sale');
const Product = require('../models/Product');
const { generateOrderCode } = require('../utils/codeGenerators');

const router = express.Router();

// Create a new sale
router.post('/', async (req, res) => {
  const { saleDate, product, status, notes } = req.body;

  if (!saleDate || !product || !status) {
    return res.status(400).send({ error: 'SaleDate, Product, and Status are required fields.' });
  }

  try {
    const orderCode = await generateOrderCode();
    const sale = new Sale({ saleDate, product, status, orderCode, notes });

    await sale.save();

    // Update product visibility to false (hide from product list)
    await Product.findByIdAndUpdate(product, { isVisible: false });

    res.status(201).send(sale);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// Fetch all sales entries
router.get('/', async (req, res) => {
  try {
    const sales = await Sale.find().populate('product');
    res.status(200).send(sales);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// Get a specific sale by ID
router.get('/:id', async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id).populate('product');
    if (!sale) {
      return res.status(404).send({ error: 'Sale not found' });
    }
    res.send(sale);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Update a sale by ID
router.put('/:id', async (req, res) => {
  const { saleDate, product, status, notes } = req.body;

  if (!saleDate || !product || !status) {
    return res.status(400).send({ error: 'SaleDate, Product, and Status are required fields.' });
  }

  try {
    const sale = await Sale.findByIdAndUpdate(req.params.id, { saleDate, product, status, notes }, { new: true, runValidators: true });
    if (!sale) {
      return res.status(404).send({ error: 'Sale not found' });
    }
    res.send(sale);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// Delete a sale by ID and update product visibility
router.delete('/:id', async (req, res) => {
  try {
    const sale = await Sale.findByIdAndDelete(req.params.id);
    if (!sale) {
      return res.status(404).send({ error: 'Sale not found' });
    }

    // Make the product visible again
    await Product.findByIdAndUpdate(sale.product, { isVisible: true });

    res.send({ message: 'Sale deleted successfully' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
