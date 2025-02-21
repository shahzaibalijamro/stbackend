const express = require("express");
const router = express.Router();
const {
  createProduct,
  getAllProducts,
  getProductByIdOrImei,
  updateProduct,
  deleteProduct,
  updateProductStatus,
  updateOriginalPrice,
  createBulkProducts,
  createReturn,
  getReturnHistory,
  deviceForTest,
  updateProductStatusAndGrade,
  updateProductStatusWithReason, // Import the new updateProductStatus function
} = require("../controllers/productController");
const { adminAuth } = require("../middleware/auth"); // Ensure `adminAuth` is imported correctly

// Product Routes

// @route   POST /api/products/createproducts
// @desc    Create a new product
// @access  Private (Admin only)
router.post("/createproducts", createProduct);
router.post("/create-return", createReturn);
router.get("/return", getReturnHistory);
router.post("/create-bulk-products", createBulkProducts);
router.get("/devices-test", deviceForTest);

// @route   GET /api/products/getallproducts
// @desc    Get all products
// @access  Public
router.get("/getallproducts", getAllProducts);

// @route   GET /api/products/getproducts/:id
// @desc    Get product by ID
// @access  Public
router.get("/getproducts/:id", getProductByIdOrImei);

// @route   PUT /api/products/editproducts/:id
// @desc    Update a product
// @access  Private (Admin only)
router.put("/editproducts/:id", updateProduct);

// @route   DELETE /api/products/deleteproducts/:id
// @desc    Delete a product
// @access  Private (Admin only)
router.delete("/deleteproducts/:id", deleteProduct);

// @route   PATCH /api/products/updatestatus/:id
// @desc    Update product status
// @access  Private (Admin only)
router.patch("/updatestatus/:id", updateProductStatus);
router.patch("/updatestatus-with-reason/:id", updateProductStatusWithReason);
router.patch("/updatestatus-grade/:id", updateProductStatusAndGrade);

router.put("/update-original-price/:id", updateOriginalPrice);

module.exports = router;
