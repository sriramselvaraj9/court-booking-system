const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const Court = require('../models/Court');
const Coach = require('../models/Coach');
const Equipment = require('../models/Equipment');
const AvailabilityChecker = require('../utils/availabilityChecker');
const PricingEngine = require('../utils/pricingEngine');

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Private
const getBookings = async (req, res) => {
  try {
    const { status, date, courtId } = req.query;
    const filter = {};

    // Regular users only see their bookings, admins see all
    if (req.user.role !== 'admin') {
      filter.user = req.user._id;
    }

    if (status) filter.status = status;
    if (courtId) filter.court = courtId;
    if (date) {
      const bookingDate = new Date(date);
      bookingDate.setHours(0, 0, 0, 0);
      const nextDay = new Date(bookingDate);
      nextDay.setDate(nextDay.getDate() + 1);
      filter.date = { $gte: bookingDate, $lt: nextDay };
    }

    const bookings = await Booking.find(filter)
      .populate('user', 'name email')
      .populate('court', 'name type')
      .populate('resources.coach', 'name hourlyRate')
      .populate('resources.equipment.item', 'name pricePerHour')
      .sort({ date: -1, startTime: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
const getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('court', 'name type basePrice')
      .populate('resources.coach', 'name hourlyRate specialization')
      .populate('resources.equipment.item', 'name pricePerHour');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user owns this booking or is admin
    if (booking.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this booking' });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get available time slots for a court
// @route   GET /api/bookings/slots/:courtId/:date
// @access  Public
const getAvailableSlots = async (req, res) => {
  try {
    const { courtId, date } = req.params;
    const slots = await AvailabilityChecker.getAvailableSlots(courtId, new Date(date));
    res.json(slots);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Check availability for a booking
// @route   POST /api/bookings/check-availability
// @access  Public
const checkAvailability = async (req, res) => {
  try {
    const { courtId, coachId, equipment, date, startTime, endTime } = req.body;

    const equipmentInventory = await Equipment.find({ isActive: true });

    const result = await AvailabilityChecker.checkAllAvailability({
      courtId,
      coachId,
      equipment,
      equipmentInventory,
      date,
      startTime,
      endTime
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Calculate price preview
// @route   POST /api/bookings/calculate-price
// @access  Public
const calculatePrice = async (req, res) => {
  try {
    const { courtId, coachId, equipment, date, startTime, endTime } = req.body;

    // Fetch court
    const court = await Court.findById(courtId);
    if (!court) {
      return res.status(404).json({ message: 'Court not found' });
    }

    // Fetch coach if provided
    let coach = null;
    if (coachId) {
      coach = await Coach.findById(coachId);
    }

    // Fetch equipment details
    const equipmentWithDetails = [];
    if (equipment && equipment.length > 0) {
      for (const item of equipment) {
        const equipmentDoc = await Equipment.findById(item.equipmentId);
        if (equipmentDoc) {
          equipmentWithDetails.push({
            equipment: equipmentDoc,
            quantity: item.quantity
          });
        }
      }
    }

    // Calculate price
    const pricing = await PricingEngine.calculatePrice({
      court,
      date: new Date(date),
      startTime,
      endTime,
      equipment: equipmentWithDetails,
      coach
    });

    res.json(pricing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { courtId, coachId, equipment, date, startTime, endTime, notes } = req.body;

    // Validate court
    const court = await Court.findById(courtId);
    if (!court || !court.isActive) {
      await session.abortTransaction();
      return res.status(400).json({ message: 'Court not available' });
    }

    // Validate coach if provided
    let coach = null;
    if (coachId) {
      coach = await Coach.findById(coachId);
      if (!coach || !coach.isActive) {
        await session.abortTransaction();
        return res.status(400).json({ message: 'Coach not available' });
      }
    }

    // Get equipment inventory
    const equipmentInventory = await Equipment.find({ isActive: true });

    // Check availability for all resources
    const availability = await AvailabilityChecker.checkAllAvailability({
      courtId,
      coachId,
      equipment,
      equipmentInventory,
      date,
      startTime,
      endTime
    });

    if (!availability.available) {
      await session.abortTransaction();
      return res.status(400).json({
        message: 'One or more resources are not available',
        issues: availability.issues
      });
    }

    // Prepare equipment with details for pricing
    const equipmentWithDetails = [];
    const bookingEquipment = [];
    if (equipment && equipment.length > 0) {
      for (const item of equipment) {
        const equipmentDoc = equipmentInventory.find(
          e => e._id.toString() === item.equipmentId.toString()
        );
        if (equipmentDoc) {
          equipmentWithDetails.push({
            equipment: equipmentDoc,
            quantity: item.quantity
          });
          bookingEquipment.push({
            item: item.equipmentId,
            quantity: item.quantity
          });
        }
      }
    }

    // Calculate final price
    const pricing = await PricingEngine.calculatePrice({
      court,
      date: new Date(date),
      startTime,
      endTime,
      equipment: equipmentWithDetails,
      coach
    });

    // Create booking
    const booking = await Booking.create([{
      user: req.user._id,
      court: courtId,
      date: new Date(date),
      startTime,
      endTime,
      resources: {
        equipment: bookingEquipment,
        coach: coachId || undefined
      },
      pricingBreakdown: pricing,
      notes,
      status: 'confirmed'
    }], { session });

    await session.commitTransaction();

    // Populate and return
    const populatedBooking = await Booking.findById(booking[0]._id)
      .populate('user', 'name email')
      .populate('court', 'name type')
      .populate('resources.coach', 'name hourlyRate')
      .populate('resources.equipment.item', 'name pricePerHour');

    res.status(201).json(populatedBooking);
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ message: error.message });
  } finally {
    session.endSession();
  }
};

// @desc    Cancel booking
// @route   PATCH /api/bookings/:id/cancel
// @access  Private
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check ownership
    if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to cancel this booking' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Booking is already cancelled' });
    }

    booking.status = 'cancelled';
    await booking.save();

    // Check for waitlist bookings and notify
    const waitlistBookings = await Booking.find({
      court: booking.court,
      date: booking.date,
      status: 'waitlist'
    }).sort({ waitlistPosition: 1 }).limit(1);

    if (waitlistBookings.length > 0) {
      // In a real app, you would send a notification here
      waitlistBookings[0].notifiedAt = new Date();
      await waitlistBookings[0].save();
    }

    res.json({ message: 'Booking cancelled successfully', booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Join waitlist for a slot
// @route   POST /api/bookings/waitlist
// @access  Private
const joinWaitlist = async (req, res) => {
  try {
    const { courtId, coachId, equipment, date, startTime, endTime, notes } = req.body;

    // Get current waitlist position
    const existingWaitlist = await Booking.find({
      court: courtId,
      date: new Date(date),
      startTime,
      endTime,
      status: 'waitlist'
    });

    const waitlistPosition = existingWaitlist.length + 1;

    // Create waitlist booking
    const booking = await Booking.create({
      user: req.user._id,
      court: courtId,
      date: new Date(date),
      startTime,
      endTime,
      resources: {
        equipment: equipment?.map(e => ({ item: e.equipmentId, quantity: e.quantity })) || [],
        coach: coachId
      },
      pricingBreakdown: { total: 0 }, // Will be calculated when confirmed
      notes,
      status: 'waitlist',
      waitlistPosition
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate('court', 'name type')
      .populate('resources.coach', 'name');

    res.status(201).json({
      message: `Added to waitlist at position ${waitlistPosition}`,
      booking: populatedBooking
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's booking history
// @route   GET /api/bookings/my-bookings
// @access  Private
const getMyBookings = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = { user: req.user._id };
    
    if (status) filter.status = status;

    const bookings = await Booking.find(filter)
      .populate('court', 'name type')
      .populate('resources.coach', 'name')
      .populate('resources.equipment.item', 'name')
      .sort({ date: -1, startTime: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getBookings,
  getBooking,
  getAvailableSlots,
  checkAvailability,
  calculatePrice,
  createBooking,
  cancelBooking,
  joinWaitlist,
  getMyBookings
};
