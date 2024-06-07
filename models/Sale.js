// models/Sale.js
const mongoose = require('mongoose');

const SaleSchema = new mongoose.Schema({
  saleDate: { type: Date, required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  status: { type: String, required: true },
  orderCode: { type: String, required: true, unique: true },
  notes: { type: String }
});

const Sale = mongoose.models.Sale || mongoose.model('Sale', SaleSchema);

module.exports = Sale;