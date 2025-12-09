const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Equipment name is required'],
    trim: true
  },
  type: {
    type: String,
    enum: ['racket', 'shoes', 'shuttlecock', 'other'],
    required: [true, 'Equipment type is required']
  },
  description: {
    type: String,
    trim: true
  },
  totalQuantity: {
    type: Number,
    required: [true, 'Total quantity is required'],
    min: 0
  },
  pricePerHour: {
    type: Number,
    required: [true, 'Price per hour is required'],
    min: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  image: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Equipment', equipmentSchema);
