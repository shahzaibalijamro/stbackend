const DeviceType = require("../models/deviceModel");

exports.addDevice = async (req, res) => {
  console.log(req.body);
  const { deviceType, brand, model } = req.body;

  try {
    // Find if the deviceType already exists
    let existingDevice = await DeviceType.findOne({ name: deviceType });

    if (existingDevice) {
      // If deviceType exists, check if the brand exists
      const brandIndex = existingDevice.brands.findIndex(
        (b) => b.name === brand
      );

      if (brandIndex !== -1) {
        // Brand exists, now add the model if it doesn't exist
        const modelExists =
          existingDevice.brands[brandIndex].models.includes(model);

        if (!modelExists) {
          existingDevice.brands[brandIndex].models.push(model);
          await existingDevice.save();
          return res
            .status(200)
            .json({ message: `Model ${model} added to brand ${brand}` });
        } else {
          return res
            .status(200)
            .json({
              message: `Model ${model} already exists for brand ${brand}`,
            });
        }
      } else {
        // Brand doesn't exist, add a new brand with the model
        existingDevice.brands.push({ name: brand, models: [model] });
        await existingDevice.save();
        return res
          .status(200)
          .json({
            message: `Brand ${brand} added to device ${deviceType} with model ${model}`,
          });
      }
    } else {
      // Device type doesn't exist, create a new device type with brand and model
      const newDeviceType = new DeviceType({
        name: deviceType,
        brands: [{ name: brand, models: [model] }],
      });

      await newDeviceType.save();
      return res
        .status(201)
        .json({
          message: `Device ${deviceType} with brand ${brand} and model ${model} added`,
        });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};

exports.deleteDevice = async (req, res) => {
  const { id } = req.params; // Device ID
  const { brand, model } = req.body; // Optional brand and model
  try {
    let device = await DeviceType.findById(id);
    if (!device) {
      return res.status(404).json({ message: "Device not found" });
    }

    if (brand && model) {
      // 1. Delete a specific model from a brand
      const brandIndex = device.brands.findIndex((b) => b.name === brand);
      if (brandIndex === -1) {
        return res.status(404).json({ message: `Brand ${brand} not found` });
      }

      const modelIndex = device.brands[brandIndex].models.indexOf(model);
      if (modelIndex === -1) {
        return res
          .status(404)
          .json({ message: `Model ${model} not found under brand ${brand}` });
      }

      // Remove the specific model from the brand
      device.brands[brandIndex].models.splice(modelIndex, 1);

      // If no models are left under this brand, you can also remove the brand
      if (device.brands[brandIndex].models.length === 0) {
        device.brands.splice(brandIndex, 1);
      }

      await device.save();
      return res
        .status(200)
        .json({
          message: `Model ${model} from brand ${brand} deleted successfully`,
        });
    } else if (brand) {
      // 2. Delete a specific brand from the device
      const brandIndex = device.brands.findIndex((b) => b.name === brand);
      if (brandIndex === -1) {
        return res.status(404).json({ message: `Brand ${brand} not found` });
      }

      // Remove the brand from the device
      device.brands.splice(brandIndex, 1);

      await device.save();
      return res
        .status(200)
        .json({
          message: `Brand ${brand} deleted successfully from device ${device.name}`,
        });
    } else {
      // 3. Delete the entire device
      await DeviceType.findByIdAndDelete(id);
      return res.status(200).json({ message: "Device deleted successfully" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};

exports.getAllDevices = async (req, res) => {
  try {
    const devices = await DeviceType.find();
    return res.status(200).json(devices);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};

exports.getDeviceById = async (req, res) => {
  const { id } = req.params;

  try {
    const device = await DeviceType.findById(id);
    if (!device) {
      return res.status(404).json({ message: "Device not found" });
    }
    return res.status(200).json(device);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};

exports.updateDevice = async (req, res) => {
  const { id } = req.params;
  const { deviceType, brand, model } = req.body;

  try {
    let device = await DeviceType.findById(id);
    if (!device) {
      return res.status(404).json({ message: "Device not found" });
    }

    // Update the device type, brand, and model
    device.name = deviceType || device.name;

    const brandIndex = device.brands.findIndex((b) => b.name === brand);

    if (brandIndex !== -1) {
      // If brand exists, update or add the model
      const modelIndex = device.brands[brandIndex].models.indexOf(model);
      if (modelIndex === -1) {
        device.brands[brandIndex].models.push(model);
      }
    } else {
      // If brand doesn't exist, add a new brand with the model
      device.brands.push({ name: brand, models: [model] });
    }

    await device.save();
    return res.status(200).json({ message: "Device updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};


