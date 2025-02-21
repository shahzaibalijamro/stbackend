const SalesManagement = require('../models/salesManagementModel');

// Get all sales records
exports.getAllSales = async (req, res) => {
    try {
        const sales = await SalesManagement.find();
        res.status(200).json(sales);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single sale record by ID
exports.getSaleById = async (req, res) => {
    try {
        const sale = await SalesManagement.findById(req.params.id);
        if (!sale) return res.status(404).json({ message: 'Sale record not found' });
        res.status(200).json(sale);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new sale record
exports.createSale = async (req, res) => {
    const {
       customerName, customerId,shipmentNumber,totalPrice,products,time
    } = req.body;

    const newSale = new SalesManagement({
        customerName, customerId,shipmentNumber,totalPrice,products, time
    });
    console.log(newSale);

    try {
        const savedSale = await newSale.save();
        res.status(201).json(savedSale);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


exports.updateSaleStatus = async (req, res) => {
    try {
        const { status } = req.body; // Assuming status is passed in the request body
        const updatedSale = await SalesManagement.findByIdAndUpdate(
            req.params.id,
            { status }, // Only updating the status field
            { new: true } // To return the updated document
        );
        console.log(updatedSale);   
        if (!updatedSale) return res.status(404).json({ message: 'Sale record not found' });
        res.status(200).json(updatedSale);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


exports.deleteSalesData = async (req, res) => {
    console.log(req.body);
    const { ids } = req.body;
    console.log(ids);
  
    if (!ids || !Array.isArray(ids)) {
      return res.status(400).json({ error: 'Invalid request data. Expected an array of IDs.' });
    }
  
    try {
      await SalesManagement.deleteMany({ _id: { $in: ids } });
      res.status(200).json({ message: 'Sales data deleted successfully.' });
    } catch (error) {
      console.error('Error deleting sales data:', error);
      res.status(500).json({ error: 'Error deleting sales data.' });
    }
  };
  