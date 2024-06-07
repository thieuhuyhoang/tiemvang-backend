const Product = require('../models/Product');
const Sale = require('../models/Sale');
const Supplier = require('../models/Supplier');

const generateSequentialCode = async (prefix, model, codeField = 'code') => {
  try {
    const lastRecord = await model.findOne().sort({ _id: -1 });
    let nextNumber = 1;

    // Determine the last number used in the code field
    if (lastRecord && lastRecord[codeField]) {
      const lastNumber = parseInt(lastRecord[codeField].replace(prefix, ''), 10);
      nextNumber = isNaN(lastNumber) ? 1 : lastNumber + 1;
    }

    // Generate a new unique code
    let nextCode;
    let isUnique = false;
    do {
      nextCode = `${prefix}${String(nextNumber).padStart(5, '0')}`;
      const existingRecord = await model.findOne({ [codeField]: nextCode });
      if (!existingRecord) {
        isUnique = true;
      } else {
        nextNumber++;
      }
    } while (!isUnique);

    return nextCode;
  } catch (error) {
    throw new Error('Error generating code: ' + error.message);
  }
};

// Function to generate a unique order code for Sales
const generateOrderCode = async () => {
  return await generateSequentialCode('ORD', Sale, 'orderCode');
};

// Function to generate a unique product code for Products
const generateProductCode = async () => {
  return await generateSequentialCode('PRD', Product, 'code');
};

// Function to generate a unique supplier code for Suppliers
const generateSupplierCode = async () => {
  return await generateSequentialCode('SUP', Supplier, 'code');
};

module.exports = {
  generateOrderCode,
  generateProductCode,
  generateSupplierCode,
};
