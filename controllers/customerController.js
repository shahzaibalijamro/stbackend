const Customer = require("../models/customerModel");

// Get all customers
exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single customer by ID
exports.getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer)
      return res.status(404).json({ message: "Customer not found" });
    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new customer
exports.createCustomer = async (req, res) => {
  console.log(req.body);
  const { customerName, customerEmail, customerPhone, commission } = req.body;

  try {
    const newCustomer = new Customer({
      customerName,
      customerEmail,
      customerPhone,
      commission,
    });
    const savedCustomer = await newCustomer.save();
    res.status(201).json(savedCustomer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update an existing customer
exports.updateCustomer = async (req, res) => {
  try {
    const { customerName, customerEmail, customerPhone, commission } = req.body;
    console.log(req.body);
    const customer = await Customer.findById(req.params.id);

    if (!customer)
      return res.status(404).json({ message: "Customer not found" });

    customer.customerName = customerName || customer.customerName;
    customer.customerEmail = customerEmail || customer.customerEmail;
    customer.customerPhone = customerPhone || customer.customerPhone;
    customer.commission = commission || customer.commission;

    const updatedCustomer = await customer.save();
    res.status(200).json(updatedCustomer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a customer
exports.deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);

    if (!customer)
      return res.status(404).json({ message: "Customer not found" });

    await customer.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: "Customer deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
