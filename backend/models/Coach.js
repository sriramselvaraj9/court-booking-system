const mongoose = require('mongoose');

const coachSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Coach name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  specialization: {
    type: String,
    trim: true
  },
  experience: {
    type: Number,
    default: 0
  },
  hourlyRate: {
    type: Number,
    required: [true, 'Hourly rate is required'],
    min: 0
  },
  bio: {
    type: String,
    trim: true
  },
  image: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  },
  // Availability slots for each day of the week (0 = Sunday, 6 = Saturday)
  availability: {
    type: Map,
    of: [{
      start: String, // "09:00"
      end: String    // "21:00"
    }],
    default: new Map([
      ['0', [{ start: '09:00', end: '18:00' }]],
      ['1', [{ start: '06:00', end: '21:00' }]],
      ['2', [{ start: '06:00', end: '21:00' }]],
      ['3', [{ start: '06:00', end: '21:00' }]],
      ['4', [{ start: '06:00', end: '21:00' }]],
      ['5', [{ start: '06:00', end: '21:00' }]],
      ['6', [{ start: '09:00', end: '18:00' }]]
    ])
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Coach', coachSchema);
