const mongoose = require('mongoose');

// DeviceType Schema
const deviceTypeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brands: [{
    name: { type: String, required: true },
    models: [{ type: String }]
  }]
});

module.exports = mongoose.model('DeviceType', deviceTypeSchema);

