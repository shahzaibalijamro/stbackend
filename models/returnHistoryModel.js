const mongoose = require("mongoose");

const returnHistorySchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true,
  },
  customerId: {
    type: String,
    required: true,
  },
  shipmentNumber: {
    type: String,
    required: true,
  },
  totalPrice: {
    type: Number, // Total price is stored as a string after `.toFixed(2)`
    required: true,
  },
  products: Array, // Array of products
  time: {
    type: String,
    required: true,
  },
  quantity : {
    type : Number,
    default : 1
  },
  status: {
    type: String,
    enum: ["delivered", "pending", "shipped", "returned"],
    // required: true,
    default: "delivered",
  },

  isReturned : {
type : Boolean,
default : false
  },


  returnDetails: {
    platform: { type: String },
    reason: { type: String },
  },
});

module.exports = mongoose.model("returnHistory", returnHistorySchema);
