const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  totalWeight: { type: Number, required: true },
  khốiLượngHột: { type: Number, required: true },
  goldWeight: { type: Number, required: true }, // Calculated field
  supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true },
  code: { type: String, required: true, unique: true }, // Unique constraint
  isVisible: { type: Boolean, default: true } // New field to manage visibility
});

// Prevent model recompilation in watch mode
const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

module.exports = Product;
