const mongoose = require('mongoose');

const SaleSchema = new mongoose.Schema({
  saleDate: { type: Date, required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  orderCode: { type: String, required: true, unique: true },
  notes: { type: String },
  status: { type: String, required: true }
});

module.exports = mongoose.model('Sale', SaleSchema);
