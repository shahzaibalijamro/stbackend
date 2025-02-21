const mongoose = require("mongoose");

const CustomerSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true,
  },
  customerEmail: {
    type: String,
    required: true,
  },
  customerPhone: {
    type: Number,
    required: true,
  },
  commission: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Customer", CustomerSchema);
