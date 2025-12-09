const mongoose = require('mongoose');

const pricingRuleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Rule name is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    enum: ['peak_hour', 'weekend', 'holiday', 'indoor_premium', 'early_bird', 'custom'],
    required: [true, 'Rule type is required']
  },
  // For time-based rules
  startTime: {
    type: String // "18:00"
  },
  endTime: {
    type: String // "21:00"
  },
  // For day-based rules (0 = Sunday, 6 = Saturday)
  applicableDays: [{
    type: Number,
    min: 0,
    max: 6
  }],
  // For specific dates (holidays)
  specificDates: [{
    type: Date
  }],
  // Price modification
  modifierType: {
    type: String,
    enum: ['multiplier', 'fixed_addition', 'fixed_subtraction', 'percentage'],
    required: true
  },
  modifierValue: {
    type: Number,
    required: [true, 'Modifier value is required']
  },
  // Applicability
  appliesTo: {
    type: String,
    enum: ['all', 'indoor', 'outdoor'],
    default: 'all'
  },
  priority: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('PricingRule', pricingRuleSchema);
