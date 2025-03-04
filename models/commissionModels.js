const mongoose = require('mongoose');

// Define the schema for the commission value
const CommissionSchema = new mongoose.Schema({
  platformCommission: {
    type: Number,
    required: true,
    default: 15,
  },
});

// Create the model
module.exports = mongoose.model('Commission', CommissionSchema);