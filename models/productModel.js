const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  arrivalCost : {
    type :Number 
  },
  deviceType: {
    type: String,
    required: true,
  },
  deviceBrand: {
    type: String,
    required: true,
  },
  deviceModel: {
    type: String,
    required: true,
  },
  deviceColor: {
    type: String,
    required: true,
  },
  condition: {
    type: String,
    required: true,
  },
  memory: {
    type: String,
    required: true,
  },
  grade: {
    type: String,
    required: true,
  },
  imei: {
    type: String,
    unique: true
  },
  info: {
    type: String,
    required: false,
  },
  price: {
    type: Number,
    required: true,
  },
  originalPrice: {
    type: Number,
    required: false,
  },
  returnDate: {
    type: Date,
    required: false,
  },
  date: {
    type: Date,
    default: Date.now, // Automatically set current date and time
    required: false,
  },
  status: {
    type: String,
    enum: [
      "To Be Repaired",
      "Ready for Sale",
      "In Progress",
      "In Confirmation",
    ], // Define allowed values
    default: "Ready for Sale", // Set a default status
    required: true,
  },

  isRepaired: {
    type: Boolean,
    default: false,
  },

  repairInfo: {
    technician: {
      name: String,
      email: String,
    },
    repairComponents: {
      lcd: String,
      batt: String,
      scocca: String,
      lcdBatt: String,
      scBattLcd: String,
      cam: String,
      fId: String,
      scocLcd: String,
      scocBatt: String,
    },
    technicainCostByEachComp: {
      lcd: String,
      batt: String,
      scocca: String,
      lcdBatt: String,
      scBattLcd: String,
      cam: String,
      fId: String,
      scocLcd: String,
      scocBatt: String,
    },
    totalTechnicianCost: {
      type: Number,
      default: 0,
    },
    totalRepairCost: {
      type: Number,
      default: 0,
    },

    reRepairInfo: {
      type: String,
    },

    totalCost: {
      type: Number,
      default: 0,
    },
  },
  paymentStatus: {
    type: String,
    enum: ["To Pay", "Paid"],
    default: "To Pay",
  },
  paymentDate: { type: Date },
  deletionDate: { type: Date },
});

module.exports = mongoose.model("Product", ProductSchema);
