// controllers/invoiceController.js
const Invoice = require("../models/invoiceModel");

const generateNextInvoiceNumber = async () => {
  const today = new Date();
  const datePrefix = `${today.getFullYear()}${String(
    today.getMonth() + 1
  ).padStart(2, "0")}${String(today.getDate()).padStart(2, "0")}`;

  const lastInvoice = await Invoice.findOne({
    invoiceNumber: { $regex: `^${datePrefix}` },
  }).sort({ invoiceNumber: -1 });

  let newInvoiceNumber;
  if (lastInvoice) {
    const lastNumber = parseInt(lastInvoice.invoiceNumber.split("-")[1]);
    newInvoiceNumber = `${datePrefix}-${String(lastNumber + 1).padStart(
      3,
      "0"
    )}`;
  } else {
    newInvoiceNumber = `${datePrefix}-001`;
  }

  return newInvoiceNumber;
};

const getNextInvoiceNumber = async (req, res) => {
  try {
    const nextInvoiceNumber = await generateNextInvoiceNumber();
    res.json({ invoiceNumber: nextInvoiceNumber });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching invoice number",
      error,
    });
  }
};

const createInvoice = async (req, res) => {
  console.log(req.body);
  try {
    const {
      invoiceNumber,
      date,
      clientCode,
      clientName,
      clientAddress,
      clientCity,
      clientCountry,
      vatNumber,
      items,
      //   description,
      //   quantity,
      //   unitPrice,
      //   vat,
      shippingCost,
      totalAmount,
    } = req.body;

    const newInvoice = new Invoice({
      invoiceNumber,
      date,
      clientCode,
      clientName,
      clientAddress,
      clientCity,
      clientCountry,
      vatNumber,
      items,
      //   description,
      //   quantity,
      //   unitPrice,
      //   vat,
      shippingCost,
      totalAmount,
    });

    await newInvoice.save();
    res.status(201).json({ success: true, invoice: newInvoice });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error creating invoice", error });
  }
};

module.exports = { getNextInvoiceNumber, createInvoice };
