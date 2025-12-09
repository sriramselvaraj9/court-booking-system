const express = require('express');
const router = express.Router();
const {
  getBookings,
  getBooking,
  getAvailableSlots,
  checkAvailability,
  calculatePrice,
  createBooking,
  cancelBooking,
  joinWaitlist,
  getMyBookings
} = require('../controllers/bookingController');
const { protect } = require('../middleware/auth');

// Public routes
router.get('/slots/:courtId/:date', getAvailableSlots);
router.post('/check-availability', checkAvailability);
router.post('/calculate-price', calculatePrice);

// Protected routes
router.get('/my-bookings', protect, getMyBookings);
router.get('/', protect, getBookings);
router.get('/:id', protect, getBooking);
router.post('/', protect, createBooking);
router.patch('/:id/cancel', protect, cancelBooking);
router.post('/waitlist', protect, joinWaitlist);

module.exports = router;
