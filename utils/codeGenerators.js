const Product = require('../models/Product');
const Sale = require('../models/Sale');
const Supplier = require('../models/Supplier');

// Utility function to generate sequential codes
const generateSequentialCode = async (prefix, model) => {
  try {
    const lastRecord = await model.findOne().sort({ _id: -1 });
    let nextNumber = 1;
    if (lastRecord && lastRecord.code) {
      const lastNumber = parseInt(lastRecord.code.replace(prefix, ''), 10);
      nextNumber = isNaN(lastNumber) ? 1 : lastNumber + 1; // Kiểm tra NaN và đặt giá trị mặc định nếu cần
    }
    const nextCode = prefix + nextNumber.toString().padStart(5, '0');
    return nextCode;
  } catch (error) {
    throw new Error('Error generating code: ' + error.message);
  }
};

// Generate a unique order code for Sale
const generateOrderCode = async () => {
  try {
    const lastSale = await Sale.findOne().sort({ _id: -1 });
    let nextNumber = 1;
    if (lastSale && lastSale.orderCode) {
      const lastNumber = parseInt(lastSale.orderCode.replace('ORD', ''), 10);
      nextNumber = isNaN(lastNumber) ? 1 : lastNumber + 1; // Kiểm tra NaN và đặt giá trị mặc định nếu cần
    }
    const newOrderCode = `ORD${String(nextNumber).padStart(5, '0')}`;
    return newOrderCode;
  } catch (error) {
    throw new Error('Error generating order code: ' + error.message);
  }
};

// Generate a unique product code for Product
const generateProductCode = async () => {
  return await generateSequentialCode('PRD', Product);
};

// Generate a unique supplier code for Supplier
const generateSupplierCode = async () => {
  return await generateSequentialCode('SUP', Supplier);
};

module.exports = {
  generateOrderCode,
  generateProductCode,
  generateSupplierCode,
};
