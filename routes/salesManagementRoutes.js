const express = require('express');
const router = express.Router();
const salesManagementController = require('../controllers/SalesManagementController');

// CRUD routes for Sales Management
router.get('/', salesManagementController.getAllSales); // Get all sales records
router.get('/:id', salesManagementController.getSaleById); // Get a sale record by ID
router.post('/', salesManagementController.createSale); // Create a new sale record
router.patch('/:id', salesManagementController.updateSaleStatus); // Update a sale record by ID
router.delete('/delete', salesManagementController.deleteSalesData);

module.exports = router;
