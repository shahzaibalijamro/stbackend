const express = require('express');
const router = express.Router();
const { getAllCustomers, getCustomerById, createCustomer, updateCustomer, deleteCustomer } = require('../controllers/customerController');

// CRUD routes
router.post('/', createCustomer); // Create a new customer
router.get('/',getAllCustomers); // Get all customers
router.get('/:id',getCustomerById); // Get a customer by ID
router.put('/:id', updateCustomer); // Update a customer by ID
router.delete('/:id', deleteCustomer); // Delete a customer by ID

module.exports = router;
