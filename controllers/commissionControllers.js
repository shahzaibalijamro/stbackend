const CommissionSchema = require('../models/commissionModels');

// Get the commission value
exports.getCommission = async (req, res) => {
  try {
    // Find the first (or only) commission document
    const commission = await CommissionSchema.findOne();

    if (commission) {
      res.status(200).json({
        success: true,
        message: 'Commission value retrieved successfully',
        commission,
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'No commission value found',
      });
    }
  } catch (error) {
    console.error('Error retrieving commission value:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve commission value',
    });
  }
};

// Set commission value
exports.setCommission = async (req, res) => {
  try {
    const { commissionValue } = req.body;
    // Convert commissionValue to a number
    const commissionValueAsNumber = parseFloat(commissionValue);

    console.log(commissionValue);
    if (
      typeof commissionValue !== 'number' ||
      commissionValue < 0 ||
      commissionValue > 100
    ) {
      return res.status(400).json({
        error: 'Invalid commission value. Must be a number between 0 and 100.',
      });
    }

    // Update or create the commission value
    const commission = await CommissionSchema.findOneAndUpdate(
      {}, // Empty filter to match any document
      { platformCommission: commissionValue },
      { upsert: true, new: true } // Create if not found
    );

    res
      .status(200)
      .json({ message: 'Commission value set successfully', commission });
  } catch (error) {
    res.status(500).json({ error: 'Failed to set commission value' });
    console.log('error', error);
  }
};

// Update the commission value
exports.updateCommission = async (req, res) => {
  try {
    const { commissionValue } = req.body;

    // Convert commissionValue to a number
    const commissionValueAsNumber = parseFloat(commissionValue);

    console.log('Received commissionValue:', commissionValue);
    console.log('Parsed commissionValue:', commissionValueAsNumber);

    // Validate commission value
    if (
      isNaN(commissionValueAsNumber) || // Check if it's a valid number
      commissionValueAsNumber < 0 ||
      commissionValueAsNumber > 100
    ) {
      return res.status(400).json({
        success: false,
        error: 'Invalid commission value. Must be a number between 0 and 100.',
      });
    }

    // Update or create the commission value
    const commission = await CommissionSchema.findOneAndUpdate(
      {}, // Empty filter to match any document
      { platformCommission: commissionValueAsNumber },
      { upsert: true, new: true } // Create if not found
    );

    res.status(200).json({
      success: true,
      message: 'Commission value updated successfully',
      commission,
    });
  } catch (error) {
    console.error('Error updating commission value:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update commission value',
    });
  }
};