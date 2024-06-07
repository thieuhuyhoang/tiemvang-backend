const mongoose = require('mongoose');
const express = require('express');
const Sale = require('../models/Sale');
const Product = require('../models/Product');
const { generateOrderCode } = require('../utils/codeGenerators');

const router = express.Router();

// Create a new sale and remove the product from inventory
router.post('/', async (req, res) => {
  const { saleDate, product, status, notes } = req.body;

  console.log('Received Sale Data:', req.body);
  if (!saleDate || !product || !status) {
    console.error('Validation Error: SaleDate, Product, and Status are required.');
    return res.status(400).send({ error: 'SaleDate, Product, and Status are required fields.' });
  }

  try {
    const orderCode = await generateOrderCode();
    console.log('Generated Order Code:', orderCode);

    // Chuyển đổi product ID thành ObjectId nếu cần thiết
    const productId = mongoose.Types.ObjectId.isValid(product) ? mongoose.Types.ObjectId(product) : null;
    if (!productId) {
      console.error('Invalid product ID');
      return res.status(400).send({ error: 'Invalid product ID' });
    }

    const sale = new Sale({ saleDate, product: productId, status, orderCode, notes });
    console.log('Saving Sale Object:', sale);

    await sale.save();

    console.log('Deleting Product:', productId);
    await Product.findByIdAndDelete(productId);

    res.status(201).send(sale);
  } catch (error) {
    console.error('Error Saving Sale:', error.message);
    res.status(400).send({ error: error.message });
  }
});

// Fetch all sales entries
router.get('/', async (req, res) => {
  try {
    // Tìm tất cả các bản ghi bán hàng và populate thông tin sản phẩm
    const sales = await Sale.find().populate('product');
    console.log('Fetched Sales:', sales); // Debug
    res.status(200).send(sales);
  } catch (error) {
    console.error('Error fetching sales:', error.message);
    res.status(400).send({ error: error.message });
  }
});

// Get a specific sale by ID
router.get('/:id', async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id).populate('product');
    if (!sale) {
      console.error('Sale not found with ID:', req.params.id);
      return res.status(404).send({ error: 'Sale not found' });
    }
    console.log('Fetched Sale by ID:', sale); // Debug
    res.send(sale);
  } catch (error) {
    console.error('Error fetching sale by ID:', error.message);
    res.status(500).send({ error: error.message });
  }
});

// Update a sale by ID
router.put('/:id', async (req, res) => {
  const { saleDate, product, status, notes } = req.body;

  if (!saleDate || !product || !status) {
    console.error('Validation Error: SaleDate, Product, and Status are required.');
    return res.status(400).send({ error: 'SaleDate, Product, and Status are required fields.' });
  }

  try {
    // Kiểm tra và chuyển đổi product ID thành ObjectId nếu cần thiết
    const productId = mongoose.Types.ObjectId.isValid(product) ? mongoose.Types.ObjectId(product) : null;
    if (!productId) {
      console.error('Invalid product ID');
      return res.status(400).send({ error: 'Invalid product ID' });
    }

    const sale = await Sale.findByIdAndUpdate(req.params.id, { saleDate, product: productId, status, notes }, { new: true, runValidators: true });
    if (!sale) {
      console.error('Sale not found with ID:', req.params.id);
      return res.status(404).send({ error: 'Sale not found' });
    }
    console.log('Updated Sale:', sale); // Debug
    res.send(sale);
  } catch (error) {
    console.error('Error updating sale:', error.message);
    res.status(400).send({ error: error.message });
  }
});

// Delete a sale by ID
router.delete('/:id', async (req, res) => {
  try {
    const sale = await Sale.findByIdAndDelete(req.params.id);
    if (!sale) {
      console.error('Sale not found with ID:', req.params.id);
      return res.status(404).send({ error: 'Sale not found' });
    }
    console.log('Deleted Sale:', sale); // Debug
    res.send({ message: 'Sale deleted successfully' });
  } catch (error) {
    console.error('Error deleting sale:', error.message);
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
