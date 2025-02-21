const express = require("express");
const Product = require("../models/productModel");
const router = express.Router();


/**
 * 🔹 1. Get All "To Pay" Devices (Unpaid Repairs)
 */
router.get("/to-pay", async (req, res) => {
  try {
    const devices = await Product.find({ paymentStatus: "To Pay", isRepaired: true });
    res.json(devices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * 🔹 2. Get All "Paid" Devices (Last 14 Days)
 */
router.get("/paid", async (req, res) => {
  try {
    const devices = await Product.find({
      paymentStatus: "Paid",
      deletionDate: { $gte: new Date() }, // Devices still within 14-day period
    });

    res.json(devices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * 🔹 3. Get Full Story (Last 3 Months of Paid Devices)
 */
router.get("/full-story", async (req, res) => {
  try {
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    const devices = await Product.find({
      paymentStatus: "Paid",
      paymentDate: { $gte: threeMonthsAgo },
    });

    res.json(devices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.get("/group-by-payment", async (req, res) => {
    try {
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
  
      const groupedPayments = await Product.aggregate([
        {
          $match: {
            paymentStatus: "Paid",
            paymentDate: { $gte: threeMonthsAgo },
          },
        },
        {
          $group: {
            _id: {
              technicianEmail: "$repairInfo.technician.email",
              paymentDate: {
                $dateToString: { format: "%Y-%m-%d", date: "$paymentDate" },
              },
            },
            technicianName: { $first: "$repairInfo.technician.name" },
            totalAmount: { $sum: "$repairInfo.totalCost" },
            devices: { $push: "$$ROOT" },
          },
        },
        {
          $sort: { "_id.paymentDate": -1 }, // Latest payments first
        },
      ]);
  
      res.json(groupedPayments);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  

/**
 * 🔹 4. Generate Invoice Before Payment
 * API fetches all unpaid devices for a technician
 */
router.get("/invoice/:technicianEmail", async (req, res) => {
    try {
      const devices = await Product.find({
        "repairInfo.technician.email": req.params.technicianEmail,
        paymentStatus: "To Pay",
      });
  
      if (!devices.length) {
        return res.status(404).json({ msg: "No unpaid devices for this technician." });
      }
  
      // Calculate the total repair cost and technician cost
      const totalRepairCost = devices.reduce((sum, device) => sum + (device.repairInfo.totalRepairCost || 0), 0);
      const totalTechnicianCost = devices.reduce((sum, device) => sum + (device.repairInfo.totalTechnicianCost || 0), 0);
  
      const totalAmount = totalRepairCost + totalTechnicianCost;
  
      res.json({
        technician: req.params.technicianEmail,
        totalDevices: devices.length,
        totalRepairCost,
        totalTechnicianCost,
        totalAmount, // Final amount to be paid for repairs
        devices,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  

/**
 * 🔹 5. Mark Multiple Devices as "Paid"
 */
router.put("/pay-multiple", async (req, res) => {
  try {
    const { deviceIds } = req.body;

    if (!Array.isArray(deviceIds) || deviceIds.length === 0) {
      return res.status(400).json({ msg: "No devices selected for payment." });
    }

    const updatedDevices = await Product.updateMany(
      { _id: { $in: deviceIds }, paymentStatus: "To Pay" },
      {
        $set: {
          paymentStatus: "Paid",
          paymentDate: new Date(),
          deletionDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // Set deletion 14 days later
        },
      }
    );

    res.json({ msg: "Devices marked as paid", updatedCount: updatedDevices.nModified });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * 🔹 6. Group Devices by Technician
 */
router.get("/group-by-technician", async (req, res) => {
  try {
    const groupedDevices = await Product.aggregate([
      {
        $group: {
          _id: "$repairInfo.technician.email",
          technicianName: { $first: "$repairInfo.technician.name" },
          devices: { $push: "$$ROOT" },
        },
      },
    ]);
    res.json(groupedDevices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
