const express = require('express');
const router = express.Router();
const {
  setCommission,
  getCommission,
  updateCommission
} = require('../controllers/commissionControllers');

router.get('', getCommission); // Get commission value
router.post('', setCommission); // Insert Commision value
router.put('',updateCommission);

module.exports = router;