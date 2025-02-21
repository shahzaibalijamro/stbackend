// models/Invoice.js
const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    description: { type: String, required: true },
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
    vat: { type: Number, required: true },
  },
  { _id: false }
);

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: { type: String, required: true, unique: true },
    date: { type: String, required: true },
    clientCode: { type: String, required: true },
    clientName: { type: String, required: true },
    clientAddress: { type: String, required: true },
    clientCity: { type: String, required: true },
    clientCountry: { type: String, required: true },
    vatNumber: { type: String, required: false },
    items: { type: [itemSchema], required: true },
    shippingCost: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
  },
  { toJSON: { getters: true } }
);

module.exports = mongoose.model("Invoice", invoiceSchema);
