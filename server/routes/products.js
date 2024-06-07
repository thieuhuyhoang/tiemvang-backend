const express = require('express');
const Product = require('../models/Product');
const { generateProductCode } = require('../utils/codeGenerators');

const router = express.Router();

// Create a new product
router.post('/', async (req, res) => {
  const { name, totalWeight, khốiLượngHột, supplier } = req.body;

  if (!name || !totalWeight || !khốiLượngHột || !supplier) {
    return res.status(400).send({ error: 'Name, TotalWeight, KhốiLượngHột, and Supplier are required fields.' });
  }

  try {
    const productCode = await generateProductCode();
    const goldWeight = totalWeight - khốiLượngHột;
    const product = new Product({ name, totalWeight, khốiLượngHột, supplier, goldWeight, code: productCode });

    await product.save(); // Lưu sản phẩm vào cơ sở dữ liệu

    res.status(201).send(product);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});
// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().populate('supplier');
    res.send(products);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Get a specific product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('supplier');
    if (!product) {
      return res.status(404).send({ error: 'Product not found' });
    }
    res.send(product);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Update a product by ID
router.put('/:id', async (req, res) => {
  const { code, name, weight, kernelWeight, supplier } = req.body;
  const goldWeight = weight - kernelWeight; // Calculate gold weight
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, { code, name, weight, goldWeight, kernelWeight, supplier }, { new: true, runValidators: true });
    if (!product) {
      return res.status(404).send({ error: 'Product not found' });
    }
    res.send(product);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// Delete a product by ID
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).send({ error: 'Product not found' });
    }
    res.send({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
