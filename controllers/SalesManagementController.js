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
    if (!sale)
      return res.status(404).json({ message: 'Sale record not found' });
    res.status(200).json(sale);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new sale record
exports.createSale = async (req, res) => {
  const {
    customerName,
    customerId,
    shipmentNumber,
    totalPrice,
    shippingCost,
    products,
    commission,
    time,
    customTotalPrice,
  } = req.body;

  console.log(req.body);

  const finalTotalPrice =
    parseFloat(totalPrice) + parseFloat(shippingCost || 0);

  const newSale = new SalesManagement({
    customerName,
    customerId,
    shipmentNumber,
    totalPrice: finalTotalPrice,
    shippingCost,
    products,
    time,
    commission,
    customTotalPrice,
  });

  // console.log(newSale)
  try {
    const savedSale = await newSale.save();
    res.status(201).json(savedSale);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateSaleStatus = async (req, res) => {
  try {
    const { status, returnDetails, isReturned } = req.body; // Assuming status and returnDetails are passed in the request body

    // Check if the sale exists
    const sale = await SalesManagement.findById(req.params.id);
    if (!sale) {
      return res.status(404).json({ message: 'Sale record not found' });
    }

    // Update the status
    sale.status = status;

    // If the status is "returned", validate and update returnDetails
    if (status === 'returned') {
      if (!returnDetails || !returnDetails.platform || !returnDetails.reason) {
        return res.status(400).json({
          message: "Return details are required when status is 'returned'.",
        });
      }
      sale.isReturned = isReturned;
      sale.returnDetails = {
        platform: returnDetails.platform,
        reason: returnDetails.reason,
      };
    }

    // Save the updated sale
    const updatedSale = await sale.save();

    res.status(200).json(updatedSale);
  } catch (error) {
    console.error('Error updating sale status:', error);
    res.status(500).json({ message: 'Failed to update sale status' });
  }
};

exports.deleteSalesData = async (req, res) => {
  console.log(req.body);
  const { ids } = req.body;
  console.log(ids);

  if (!ids || !Array.isArray(ids)) {
    return res
      .status(400)
      .json({ error: 'Invalid request data. Expected an array of IDs.' });
  }

  try {
    await SalesManagement.deleteMany({ _id: { $in: ids } });
    res.status(200).json({ message: 'Sales data deleted successfully.' });
  } catch (error) {
    console.error('Error deleting sales data:', error);
    res.status(500).json({ error: 'Error deleting sales data.' });
  }
};
