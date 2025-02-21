// routes/invoiceRoutes.js
const express = require('express');
const router = express.Router();
const { getNextInvoiceNumber, createInvoice } = require('../controllers/invoiceController');

router.get('/next-invoice-number', getNextInvoiceNumber);
router.post('/create', createInvoice);

module.exports = router;
