const express = require('express');
const Supplier = require('../models/Supplier');
const { generateSupplierCode } = require('../utils/codeGenerators');

const router = express.Router();

// Create a new supplier
router.post('/', async (req, res) => {
  const { name, address } = req.body;

  console.log('Received Supplier Data:', req.body);
  if (!name || !address) {
    console.error('Validation Error: Name and Address are required.');
    return res.status(400).send({ error: 'Name and Address are required fields.' });
  }

  try {
    const supplierCode = await generateSupplierCode();
    console.log('Generated Supplier Code:', supplierCode); // Log mã nhà cung cấp mới

    const supplier = new Supplier({ name, address, code: supplierCode });
    console.log('Saving Supplier Object:', supplier);

    await supplier.save();

    res.status(201).send(supplier);
  } catch (error) {
    console.error('Error Saving Supplier:', error.message);
    res.status(400).send({ error: error.message });
  }
});
// Get all suppliers
router.get('/', async (req, res) => {
  try {
    const suppliers = await Supplier.find();
    res.send(suppliers);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Get a specific supplier by ID
router.get('/:id', async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) {
      return res.status(404).send({ error: 'Supplier not found' });
    }
    res.send(supplier);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Update a supplier by ID
router.put('/:id', async (req, res) => {
  try {
    const supplier = await Supplier.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!supplier) {
      return res.status(404).send({ error: 'Supplier not found' });
    }
    res.send(supplier);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// Delete a supplier by ID
router.delete('/:id', async (req, res) => {
  try {
    const supplier = await Supplier.findByIdAndDelete(req.params.id);
    if (!supplier) {
      return res.status(404).send({ error: 'Supplier not found' });
    }
    res.send({ message: 'Supplier deleted successfully' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
