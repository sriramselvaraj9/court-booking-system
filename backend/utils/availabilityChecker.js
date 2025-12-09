const Booking = require('../models/Booking');

/**
 * Availability Checker
 * Handles multi-resource availability checking for courts, coaches, and equipment
 */
class AvailabilityChecker {
  /**
   * Check if a time slot overlaps with another
   * @param {String} start1 - First slot start time (HH:mm)
   * @param {String} end1 - First slot end time (HH:mm)
   * @param {String} start2 - Second slot start time (HH:mm)
   * @param {String} end2 - Second slot end time (HH:mm)
   * @returns {Boolean} True if slots overlap
   */
  static timeSlotsOverlap(start1, end1, start2, end2) {
    const toMinutes = (time) => {
      const [hours, minutes] = time.split(':').map(Number);
      return hours * 60 + minutes;
    };

    const s1 = toMinutes(start1);
    const e1 = toMinutes(end1);
    const s2 = toMinutes(start2);
    const e2 = toMinutes(end2);

    // Slots overlap if one starts before the other ends
    return s1 < e2 && s2 < e1;
  }

  /**
   * Check if a court is available for a given time slot
   * @param {String} courtId - Court ID
   * @param {Date} date - Booking date
   * @param {String} startTime - Start time (HH:mm)
   * @param {String} endTime - End time (HH:mm)
   * @param {String} excludeBookingId - Optional booking ID to exclude (for updates)
   * @returns {Object} { available: Boolean, conflictingBooking: Object }
   */
  static async checkCourtAvailability(courtId, date, startTime, endTime, excludeBookingId = null) {
    const bookingDate = new Date(date);
    bookingDate.setHours(0, 0, 0, 0);
    
    const nextDay = new Date(bookingDate);
    nextDay.setDate(nextDay.getDate() + 1);

    const query = {
      court: courtId,
      date: { $gte: bookingDate, $lt: nextDay },
      status: { $in: ['confirmed', 'pending'] }
    };

    if (excludeBookingId) {
      query._id = { $ne: excludeBookingId };
    }

    const existingBookings = await Booking.find(query);

    for (const booking of existingBookings) {
      if (this.timeSlotsOverlap(startTime, endTime, booking.startTime, booking.endTime)) {
        return {
          available: false,
          conflictingBooking: booking
        };
      }
    }

    return { available: true, conflictingBooking: null };
  }

  /**
   * Check if a coach is available for a given time slot
   * @param {String} coachId - Coach ID
   * @param {Date} date - Booking date
   * @param {String} startTime - Start time (HH:mm)
   * @param {String} endTime - End time (HH:mm)
   * @param {String} excludeBookingId - Optional booking ID to exclude
   * @returns {Object} { available: Boolean, conflictingBooking: Object }
   */
  static async checkCoachAvailability(coachId, date, startTime, endTime, excludeBookingId = null) {
    if (!coachId) {
      return { available: true, conflictingBooking: null };
    }

    const bookingDate = new Date(date);
    bookingDate.setHours(0, 0, 0, 0);
    
    const nextDay = new Date(bookingDate);
    nextDay.setDate(nextDay.getDate() + 1);

    const query = {
      'resources.coach': coachId,
      date: { $gte: bookingDate, $lt: nextDay },
      status: { $in: ['confirmed', 'pending'] }
    };

    if (excludeBookingId) {
      query._id = { $ne: excludeBookingId };
    }

    const existingBookings = await Booking.find(query);

    for (const booking of existingBookings) {
      if (this.timeSlotsOverlap(startTime, endTime, booking.startTime, booking.endTime)) {
        return {
          available: false,
          conflictingBooking: booking
        };
      }
    }

    return { available: true, conflictingBooking: null };
  }

  /**
   * Check if equipment is available for a given time slot
   * @param {Array} requestedEquipment - Array of { equipmentId, quantity }
   * @param {Array} equipmentInventory - Array of equipment documents
   * @param {Date} date - Booking date
   * @param {String} startTime - Start time (HH:mm)
   * @param {String} endTime - End time (HH:mm)
   * @param {String} excludeBookingId - Optional booking ID to exclude
   * @returns {Object} { available: Boolean, unavailableItems: Array }
   */
  static async checkEquipmentAvailability(requestedEquipment, equipmentInventory, date, startTime, endTime, excludeBookingId = null) {
    if (!requestedEquipment || requestedEquipment.length === 0) {
      return { available: true, unavailableItems: [] };
    }

    const bookingDate = new Date(date);
    bookingDate.setHours(0, 0, 0, 0);
    
    const nextDay = new Date(bookingDate);
    nextDay.setDate(nextDay.getDate() + 1);

    const unavailableItems = [];

    for (const requested of requestedEquipment) {
      const equipment = equipmentInventory.find(
        e => e._id.toString() === requested.equipmentId.toString()
      );

      if (!equipment) {
        unavailableItems.push({
          equipmentId: requested.equipmentId,
          reason: 'Equipment not found'
        });
        continue;
      }

      // Count how many of this equipment are already booked for overlapping slots
      const query = {
        'resources.equipment.item': requested.equipmentId,
        date: { $gte: bookingDate, $lt: nextDay },
        status: { $in: ['confirmed', 'pending'] }
      };

      if (excludeBookingId) {
        query._id = { $ne: excludeBookingId };
      }

      const overlappingBookings = await Booking.find(query);

      let bookedQuantity = 0;
      for (const booking of overlappingBookings) {
        if (this.timeSlotsOverlap(startTime, endTime, booking.startTime, booking.endTime)) {
          const bookedItem = booking.resources.equipment.find(
            e => e.item.toString() === requested.equipmentId.toString()
          );
          if (bookedItem) {
            bookedQuantity += bookedItem.quantity;
          }
        }
      }

      const availableQuantity = equipment.totalQuantity - bookedQuantity;
      if (requested.quantity > availableQuantity) {
        unavailableItems.push({
          equipmentId: requested.equipmentId,
          equipmentName: equipment.name,
          requested: requested.quantity,
          available: availableQuantity,
          reason: 'Insufficient quantity'
        });
      }
    }

    return {
      available: unavailableItems.length === 0,
      unavailableItems
    };
  }

  /**
   * Check all resources availability in one call
   * @param {Object} params - Booking parameters
   * @returns {Object} Combined availability result
   */
  static async checkAllAvailability({
    courtId,
    coachId,
    equipment,
    equipmentInventory,
    date,
    startTime,
    endTime,
    excludeBookingId = null
  }) {
    const [courtResult, coachResult, equipmentResult] = await Promise.all([
      this.checkCourtAvailability(courtId, date, startTime, endTime, excludeBookingId),
      this.checkCoachAvailability(coachId, date, startTime, endTime, excludeBookingId),
      this.checkEquipmentAvailability(equipment, equipmentInventory, date, startTime, endTime, excludeBookingId)
    ]);

    const allAvailable = courtResult.available && coachResult.available && equipmentResult.available;

    const issues = [];
    if (!courtResult.available) {
      issues.push({ resource: 'court', message: 'Court is already booked for this time slot' });
    }
    if (!coachResult.available) {
      issues.push({ resource: 'coach', message: 'Coach is already booked for this time slot' });
    }
    if (!equipmentResult.available) {
      issues.push({ 
        resource: 'equipment', 
        message: 'Some equipment is not available',
        details: equipmentResult.unavailableItems 
      });
    }

    return {
      available: allAvailable,
      court: courtResult,
      coach: coachResult,
      equipment: equipmentResult,
      issues
    };
  }

  /**
   * Get all available time slots for a court on a given date
   * @param {String} courtId - Court ID
   * @param {Date} date - Date to check
   * @param {Number} slotDuration - Duration in minutes (default 60)
   * @returns {Array} Available time slots
   */
  static async getAvailableSlots(courtId, date, slotDuration = 60) {
    const operatingHours = { start: 6, end: 22 }; // 6 AM to 10 PM
    const bookingDate = new Date(date);
    bookingDate.setHours(0, 0, 0, 0);
    
    const nextDay = new Date(bookingDate);
    nextDay.setDate(nextDay.getDate() + 1);

    // Get all confirmed bookings for this court on this date
    const existingBookings = await Booking.find({
      court: courtId,
      date: { $gte: bookingDate, $lt: nextDay },
      status: { $in: ['confirmed', 'pending'] }
    }).sort({ startTime: 1 });

    const slots = [];
    const slotHours = slotDuration / 60;

    for (let hour = operatingHours.start; hour < operatingHours.end; hour += slotHours) {
      const startTime = `${String(Math.floor(hour)).padStart(2, '0')}:${String((hour % 1) * 60).padStart(2, '0')}`;
      const endHour = hour + slotHours;
      const endTime = `${String(Math.floor(endHour)).padStart(2, '0')}:${String((endHour % 1) * 60).padStart(2, '0')}`;

      let isAvailable = true;
      for (const booking of existingBookings) {
        if (this.timeSlotsOverlap(startTime, endTime, booking.startTime, booking.endTime)) {
          isAvailable = false;
          break;
        }
      }

      slots.push({
        startTime,
        endTime,
        available: isAvailable
      });
    }

    return slots;
  }
}

module.exports = AvailabilityChecker;
