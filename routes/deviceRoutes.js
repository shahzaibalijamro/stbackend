const express = require('express');
const router = express.Router();
const { addDevice, getAllDevices, getDeviceById, updateDevice, deleteDevice } = require('../controllers/deviceController');

// Create
router.post('/', addDevice);

// Read All
router.get('/', getAllDevices);

// Read Single by ID
router.get('/:id', getDeviceById);

// Update
router.put('/:id', updateDevice);

// API to get all models in array format


// Delete
router.delete('/:id', deleteDevice);

module.exports = router;
