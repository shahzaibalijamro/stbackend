const express = require("express");
const productModel = require("../models/productModel");
const CostMaterial = require("../models/materialModel");
const CostTechnical = require("../models/technicianModel");
const salesManagementModel = require("../models/salesManagementModel");
const router = express.Router();

router.get("/repair", async (req, res) => {


  try {
    const product = await productModel.find({
      status: "To Be Repaired",
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found or not in repair status" });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});


router.get("/get-material-cost/:model", async (req, res) => {
  try {
    const model = decodeURIComponent(req.params.model);

    console.log(model)

    // Find the cost material for the given model
    const costMaterial = await CostMaterial.findOne({ model });

    if (!costMaterial) {
      return res.status(404).json({ message: "Model not found" });
    }

    res.json({
      message: "Cost material found successfully",
      costMaterial,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching cost material", error });
  }
});
router.get("/get-technician-cost/:model", async (req, res) => {
  try {
    const model = decodeURIComponent(req.params.model);

    // console.log(model)

    // Find the cost material for the given model
    const costMaterial = await CostTechnical.findOne({ model });

    if (!costMaterial) {
      return res.status(404).json({ message: "Model not found" });
    }

    res.json({
      message: "Cost material found successfully",
      costMaterial,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching cost material", error });
  }
});

router.put("/repair/:imei", async (req, res) => {
    try {
      const { imei } = req.params;
      const updateData = req.body;
  
      // Find the product by IMEI
      const product = await productModel.findOne({ imei });
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
  
      // Ensure repairInfo exists
      if (
        !updateData.repairInfo ||
        !updateData.repairInfo.repairComponents ||
        !updateData.repairInfo.technicainCostByEachComp
      ) {
        return res.status(400).json({ message: "Invalid repair data" });
      }
  
      const { repairComponents, technicainCostByEachComp } =
        updateData.repairInfo;
  
      // Convert values from string to numbers
      let totalRepairCost = 0;
      let totalTechnicianCost = 0;
  
      Object.keys(repairComponents).forEach((component) => {
        totalRepairCost += Number(repairComponents[component]) || 0;
      });
  
      Object.keys(technicainCostByEachComp).forEach((component) => {
        totalTechnicianCost += Number(technicainCostByEachComp[component]) || 0;
      });
  
      const totalCost = totalRepairCost + totalTechnicianCost;
  
      console.log("Calculated Costs:", {
        totalRepairCost,
        totalTechnicianCost,
        totalCost,
        updateData
      });
  
      // Update the product with repair details and calculated cost
      const updatedProduct = await productModel.findOneAndUpdate(
        { imei },
        {
          $set: {
            repairInfo: {
              ...updateData.repairInfo,
              totalRepairCost: totalRepairCost, // ✅ Ensure values are updated
              totalTechnicianCost: totalTechnicianCost,
              totalCost: totalCost,
              technician : {
                name: updateData.name,
                email : updateData.email
              },
            },
            isRepaired: updateData.isRepaired,
            
            status: "In Confirmation",
          },
        },
        { new: true }
      );
  
      return res.json({
        message: "Repair details updated successfully",
        updatedProduct,
      });
    } catch (error) {
      console.error("Error updating repair details:", error);
      return res
        .status(500)
        .json({ message: "Error updating repair details", error });
    }
  });

  router.get("/technician-sales", async (req, res) => {
    try {
      const now = new Date();

      // Monthly date range
      const monthStartDate = new Date(now.getFullYear(), now.getMonth(), 1);
      const monthEndDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      // Yearly date range 
      const yearStartDate = new Date(now.getFullYear(), 0, 1);
      const yearEndDate = new Date(now.getFullYear(), 11, 31);

      // Get monthly repair data from products
      const monthlyRepairData = await productModel.find({
        'repairInfo.completionDate': {
          $gte: monthStartDate,
          $lte: monthEndDate
        },
        isRepaired: true
      });

      // Get monthly sales data
      const monthlySalesData = await salesManagementModel.find({
        time: {
          $gte: monthStartDate.toISOString(),
          $lte: monthEndDate.toISOString()
        }
      });

      // Get yearly repair data from products
      const yearlyRepairData = await productModel.find({
        'repairInfo.completionDate': {
          $gte: yearStartDate,
          $lte: yearEndDate
        },
        isRepaired: true
      });

      // Get yearly sales data
      const yearlySalesData = await salesManagementModel.find({
        time: {
          $gte: yearStartDate.toISOString(),
          $lte: yearEndDate.toISOString()
        }
      });

      // Calculate monthly totals
      let monthlyTotals = {
        fromRepairs: 0,
        fromSales: 0,
        netProfit: 0
      };

      monthlySalesData.forEach(repair => {
        repair.products.forEach(product => {
          if (product.repairInfo && product.repairInfo.totalTechnicianCost) {
            monthlyTotals.fromRepairs += product.repairInfo.totalTechnicianCost;
            monthlyTotals.netProfit += (product.repairInfo.totalCost + repair.shippingCost + product.productPrice)-repair.totalPrice;
            console.log(product.repairInfo.totalTechnicianCost)
          }
        })
      });

      monthlySalesData.forEach(sale => {
        if (sale.commission) {
          monthlyTotals.fromSales += sale.commission;
        }
      });

      // Calculate yearly totals
      let yearlyTotals = {
        fromRepairs: 0,
        fromSales: 0,
        netProfit: 0
      };

      // console.log(monthlySalesData)
      yearlySalesData.forEach(repair => {
        // if (repair.repairInfo && repair.repairInfo.totalTechnicianCost) {
        //   yearlyTotals.fromRepairs += repair.repairInfo.totalTechnicianCost;
        // }
        repair.products.forEach(product => {
          if (product.repairInfo && product.repairInfo.totalTechnicianCost) {
            yearlyTotals.fromRepairs += product.repairInfo.totalTechnicianCost;
            yearlyTotals.netProfit += (product.repairInfo.totalCost + repair.shippingCost + product.productPrice)-repair.totalPrice;
            console.log(product.repairInfo.totalTechnicianCost)
          }
        })
      });

      yearlySalesData.forEach(sale => {
        if (sale.commission) {
          yearlyTotals.fromSales += sale.commission;
        }
      });

      res.json({
        monthly: {
          dateRange: {
            start: monthStartDate,
            end: monthEndDate
          },
          totalTechnicianCosts: monthlyTotals.fromRepairs,
          totalSalesCommission: monthlyTotals.fromSales,
          totalEarnings: monthlyTotals.fromRepairs + monthlyTotals.fromSales,
          repairsCount: monthlyRepairData.length,
          salesCount: monthlySalesData.length,
          netProfit: monthlyTotals.netProfit
        },
        yearly: {
          dateRange: {
            start: yearStartDate,
            end: yearEndDate
          },
          totalTechnicianCosts: yearlyTotals.fromRepairs,
          totalSalesCommission: yearlyTotals.fromSales,
          totalEarnings: yearlyTotals.fromRepairs + yearlyTotals.fromSales,
          repairsCount: yearlyRepairData.length,
          salesCount: yearlySalesData.length,
          netProfit: yearlyTotals.netProfit 
        }
      });

    } catch (error) {
      console.error("Error fetching technician costs:", error);
      res.status(500).json({ message: "Error fetching technician costs data", error: error.message });
    }
  });

module.exports = router;
