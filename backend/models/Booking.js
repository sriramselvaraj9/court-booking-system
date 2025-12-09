const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  court: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Court',
    required: [true, 'Court is required']
  },
  date: {
    type: Date,
    required: [true, 'Booking date is required']
  },
  startTime: {
    type: String, // "14:00"
    required: [true, 'Start time is required']
  },
  endTime: {
    type: String, // "15:00"
    required: [true, 'End time is required']
  },
  // Optional resources
  resources: {
    equipment: [{
      item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Equipment'
      },
      quantity: {
        type: Number,
        default: 1
      }
    }],
    coach: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Coach'
    }
  },
  status: {
    type: String,
    enum: ['confirmed', 'cancelled', 'completed', 'waitlist', 'pending'],
    default: 'confirmed'
  },
  // Detailed pricing breakdown for transparency
  pricingBreakdown: {
    basePrice: {
      type: Number,
      default: 0
    },
    courtFee: {
      type: Number,
      default: 0
    },
    equipmentFee: {
      type: Number,
      default: 0
    },
    coachFee: {
      type: Number,
      default: 0
    },
    appliedRules: [{
      ruleName: String,
      ruleType: String,
      adjustment: Number
    }],
    subtotal: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      required: [true, 'Total price is required']
    }
  },
  notes: {
    type: String,
    trim: true
  },
  // For waitlist functionality
  waitlistPosition: {
    type: Number
  },
  notifiedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for efficient availability queries
bookingSchema.index({ court: 1, date: 1, status: 1 });
bookingSchema.index({ 'resources.coach': 1, date: 1, status: 1 });
bookingSchema.index({ user: 1, status: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
