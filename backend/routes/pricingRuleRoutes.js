const express = require('express');
const router = express.Router();
const {
  getPricingRules,
  getPricingRule
} = require('../controllers/pricingRuleController');

router.get('/', getPricingRules);
router.get('/:id', getPricingRule);

module.exports = router;
