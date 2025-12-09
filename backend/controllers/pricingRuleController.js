const PricingRule = require('../models/PricingRule');

// @desc    Get all pricing rules
// @route   GET /api/pricing-rules
// @access  Public
const getPricingRules = async (req, res) => {
  try {
    const { isActive, type } = req.query;
    const filter = {};
    
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    if (type) filter.type = type;

    const rules = await PricingRule.find(filter).sort({ priority: -1 });
    res.json(rules);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single pricing rule
// @route   GET /api/pricing-rules/:id
// @access  Public
const getPricingRule = async (req, res) => {
  try {
    const rule = await PricingRule.findById(req.params.id);
    if (!rule) {
      return res.status(404).json({ message: 'Pricing rule not found' });
    }
    res.json(rule);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create pricing rule
// @route   POST /api/admin/pricing-rules
// @access  Private/Admin
const createPricingRule = async (req, res) => {
  try {
    const {
      name,
      description,
      type,
      startTime,
      endTime,
      applicableDays,
      specificDates,
      modifierType,
      modifierValue,
      appliesTo,
      priority
    } = req.body;

    const rule = await PricingRule.create({
      name,
      description,
      type,
      startTime,
      endTime,
      applicableDays,
      specificDates,
      modifierType,
      modifierValue,
      appliesTo,
      priority
    });

    res.status(201).json(rule);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update pricing rule
// @route   PUT /api/admin/pricing-rules/:id
// @access  Private/Admin
const updatePricingRule = async (req, res) => {
  try {
    const rule = await PricingRule.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!rule) {
      return res.status(404).json({ message: 'Pricing rule not found' });
    }

    res.json(rule);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete pricing rule
// @route   DELETE /api/admin/pricing-rules/:id
// @access  Private/Admin
const deletePricingRule = async (req, res) => {
  try {
    const rule = await PricingRule.findByIdAndDelete(req.params.id);

    if (!rule) {
      return res.status(404).json({ message: 'Pricing rule not found' });
    }

    res.json({ message: 'Pricing rule deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle pricing rule active status
// @route   PATCH /api/admin/pricing-rules/:id/toggle
// @access  Private/Admin
const togglePricingRuleStatus = async (req, res) => {
  try {
    const rule = await PricingRule.findById(req.params.id);

    if (!rule) {
      return res.status(404).json({ message: 'Pricing rule not found' });
    }

    rule.isActive = !rule.isActive;
    await rule.save();

    res.json(rule);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getPricingRules,
  getPricingRule,
  createPricingRule,
  updatePricingRule,
  deletePricingRule,
  togglePricingRuleStatus
};
