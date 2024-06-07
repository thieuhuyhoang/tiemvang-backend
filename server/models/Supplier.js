const mongoose = require('mongoose');

const SupplierSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  address: { type: String, required: true },
});

module.exports = mongoose.model('Supplier', SupplierSchema);
