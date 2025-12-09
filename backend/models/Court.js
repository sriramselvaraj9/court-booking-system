const mongoose = require('mongoose');

const courtSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Court name is required'],
    trim: true
  },
  type: {
    type: String,
    enum: ['indoor', 'outdoor'],
    required: [true, 'Court type is required']
  },
  description: {
    type: String,
    trim: true
  },
  basePrice: {
    type: Number,
    required: [true, 'Base price is required'],
    min: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  amenities: [{
    type: String
  }],
  image: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Court', courtSchema);
