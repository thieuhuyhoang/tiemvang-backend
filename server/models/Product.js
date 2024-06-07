const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  totalWeight: { type: Number, required: true },
  khốiLượngHột: { type: Number, required: true },
  goldWeight: { type: Number, required: true }, // Trường này được tính từ totalWeight - khốiLượngHột
  supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true },
  code: { type: String, required: true, unique: true } // Mã sản phẩm duy nhất
});

module.exports = mongoose.model('Product', ProductSchema);
