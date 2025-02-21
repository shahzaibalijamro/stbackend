const productModel = require("../models/productModel");
const Product = require("../models/productModel");
const returnHistoryModel = require("../models/returnHistoryModel");
const salesManagementModel = require("../models/salesManagementModel");

// @desc    Create a new product
// @route   POST /api/products
// @access  Private (Admin only)
exports.createProduct = async (req, res) => {
  console.log(req.body);
  const {
    deviceType,
    deviceBrand,
    deviceModel,
    deviceColor,
    condition,
    memory,
    grade,
    imei,
    info,
    price,
    status,
    arrivalCost
  } = req.body;

  try {
    let product = await Product.findOne({ imei });
    console.log(product);
    if (product) {
      return res.status(400).json({ msg: "Imei already exists" });
    }

    product = new Product({
      deviceType,
      deviceBrand,
      deviceModel,
      deviceColor,
      condition,
      memory,
      grade,
      imei,
      info,
      price,
      status,
      arrivalCost,
      originalPrice: price,
    });

    await product.save();
    res.status(201).json(product);

    
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
exports.createReturn = async (req, res) => {
  try {
    console.log(req.body);

    const { id } = req.body;
    console.log(id, "id");

    // Find the sale document
    const sale = await salesManagementModel.findById(id);
    if (!sale) {
      return res.status(404).json({ error: "Sale not found" });
    }

    // Convert Mongoose document to a plain JavaScript object
    const saleObj = sale.toObject();
    
    // Remove MongoDB-specific fields
    delete saleObj._id;
    delete saleObj.__v;

    console.log(saleObj, "sale after removing _id");

    // Create a new entry in returnHistoryModel
    const history = await returnHistoryModel.create(saleObj);

    console.log(history, "Return history created");

    res.status(201).json({ message: "Return history created successfully", history });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.getReturnHistory = async (req, res) => {
  try {
    const { id } = req.params; // Get ID from request params

    if (id) {
      // If an ID is provided, find a specific return history record
      const returnHistory = await returnHistoryModel.findById(id);
      if (!returnHistory) {
        return res.status(404).json({ error: "Return history not found" });
      }
      return res.status(200).json(returnHistory);
    }

    // If no ID is provided, fetch all return history records
    const allReturns = await returnHistoryModel.find();
    res.status(200).json(allReturns);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};



exports.createBulkProducts = async (req, res) => {
  const {
    deviceType,
    deviceBrand,
    deviceModel,
    deviceColor,
    condition,
    memory,
    grade,
    imei, // Expect an array of IMEIs
    info,
    price,
    status,
  } = req.body;

  try {
    // Validate IMEI list
    if (!imei || !Array.isArray(imei) || imei.length === 0) {
      return res.status(400).json({ msg: "IMEI list is required and cannot be empty." });
    }

    // Check for duplicates in the database
    const existingProducts = await Product.find({ imei: { $in: imei } });

    if (existingProducts.length > 0) {
      const duplicateIMEIs = existingProducts.map((product) => product.imei);
      return res.status(400).json({
        msg: "Duplicate IMEIs found. No products were added.",
        duplicateIMEIs,
      });
    }

    // If no duplicates, prepare products for insertion
    const productsToSave = imei.map((imei) => ({
      deviceType,
      deviceBrand,
      deviceModel,
      deviceColor,
      condition,
      memory,
      grade,
      imei,
      info,
      price,
      status,
      originalPrice: price,
    }));

    // Save all products in bulk
    await Product.insertMany(productsToSave);

    res.status(201).json({
      msg: "All products added successfully.",
      addedProducts: imei,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
exports.deviceForTest = async (req, res) => {
  try {
   const  products = await productModel.find({
      status : "In Confirmation"
    })

    res.status(200).json({testDevices:products})

  } catch (error) {
    console.error(error);
    res.status(400).json(
      {
        msg: "Error fetching test devices",
      }
    )
  }
};


// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// @desc    Get product by ID
// @route   GET /api/products/:id
// @access  Public

exports.getProductByIdOrImei = async (req, res) => {
  try {
    const identifier = req.params.id;

    // Extract numeric part for _id search
    const numericProductId = identifier.replace(/\D/g, "");

    // Find all products (existing logic)
    const products = await Product.find();

    // Search for product by modified _id
    const productById = products.find(
      (p) => p._id.toString().replace(/\D/g, "") === numericProductId
    );

    if (productById) {
      return res.json(productById);
    }

    // If not found by _id, search directly by imei
    const productByImei = await Product.findOne({ imei: identifier });

    if (productByImei) {
      return res.json(productByImei);
    }

    // If not found by either _id or imei, return 404
    return res.status(404).json({ msg: "Product not found" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private (Admin only)
exports.updateProduct = async (req, res) => {
  const {
    deviceType,
    deviceBrand,
    deviceModel,
    deviceColor,
    condition,
    memory,
    grade,
    imei,
    info,
    price,
  } = req.body;

  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    product.deviceType = deviceType;
    product.deviceBrand = deviceBrand;
    product.deviceModel = deviceModel;
    product.deviceColor = deviceColor;
    product.condition = condition;
    product.memory = memory;
    product.grade = grade;
    product.imei = imei;
    product.info = info;
    product.price = price;

    await product.save();
    res.json(product);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Product not found" });
    }
    res.status(500).send("Server error");
  }
};

// @desc    Update product status
// @route   PATCH /api/products/:id/status
// @access  Private (Admin only)
exports.updateProductStatus = async (req, res) => {
  const { status } = req.body;

  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    // Update only the status field
    product.status = status;

    await product.save();
    res.json({ msg: "Status updated", product });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Product not found" });
    }
    res.status(500).send("Server error");
  }
};
exports.updateProductStatusWithReason = async (req, res) => {
  const { status , reason} = req.body;

  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    // Update only the status field
    product.status = status;
    product.repairInfo.reRepairInfo = reason;

    await product.save();
    res.json({ msg: "Status updated", product });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Product not found" });
    }
    res.status(500).send("Server error");
  }
};
exports.updateProductStatusAndGrade = async (req, res) => {
  const { status, grade , color, info} = req.body;

  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    // Update only the status field
    product.status = status;
    product.grade = grade;
    if(info){
      product.info = info
    }
    if(color){
      product.deviceColor = color
    }
    product.price = product.price + product.repairInfo?.totalCost
    product.originalPrice = product.price + product.repairInfo?.totalCost

    await product.save();
    res.json({ msg: "Status updated", product });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Product not found" });
    }
    res.status(500).send("Server error");
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private (Admin only)
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    await Product.deleteOne({ _id: req.params.id });
    res.json({ msg: "Product removed" });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Product not found" });
    }
    res.status(500).send("Server error");
  }
};

// Update original price by product ID
exports.updateOriginalPrice = async (req, res) => {
  const { id } = req.params; // Extract product ID from the request parameters
  const { originalPrice } = req.body; // Extract new original price from the request body

  try {
    // Find the product by its ID and update the originalPrice field
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { originalPrice },
      { new: true } // Return the updated document
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({
      message: "Original price updated successfully",
      updatedProduct,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};
