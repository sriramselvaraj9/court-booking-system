const PricingRule = require('../models/PricingRule');

/**
 * Dynamic Pricing Engine
 * Calculates the total price based on configurable rules that can stack
 */
class PricingEngine {
  /**
   * Calculate the total price for a booking
   * @param {Object} params - Booking parameters
   * @param {Object} params.court - Court object with basePrice and type
   * @param {Date} params.date - Booking date
   * @param {String} params.startTime - Start time (HH:mm)
   * @param {String} params.endTime - End time (HH:mm)
   * @param {Array} params.equipment - Array of equipment with quantities
   * @param {Object} params.coach - Coach object with hourlyRate
   * @returns {Object} Pricing breakdown
   */
  static async calculatePrice({ court, date, startTime, endTime, equipment = [], coach = null }) {
    const breakdown = {
      basePrice: court.basePrice,
      courtFee: 0,
      equipmentFee: 0,
      coachFee: 0,
      appliedRules: [],
      subtotal: 0,
      total: 0
    };

    // Calculate duration in hours
    const duration = this.calculateDuration(startTime, endTime);

    // Get active pricing rules sorted by priority
    const rules = await PricingRule.find({ isActive: true }).sort({ priority: -1 });

    // Start with base court price
    let courtPrice = court.basePrice * duration;
    breakdown.courtFee = courtPrice;

    // Apply each applicable rule
    for (const rule of rules) {
      const adjustment = this.applyRule(rule, {
        courtPrice,
        courtType: court.type,
        date,
        startTime,
        endTime
      });

      if (adjustment !== 0) {
        courtPrice += adjustment;
        breakdown.appliedRules.push({
          ruleName: rule.name,
          ruleType: rule.type,
          adjustment: adjustment
        });
      }
    }

    breakdown.courtFee = courtPrice;

    // Calculate equipment fees
    for (const item of equipment) {
      if (item.equipment && item.quantity > 0) {
        const equipmentFee = item.equipment.pricePerHour * item.quantity * duration;
        breakdown.equipmentFee += equipmentFee;
      }
    }

    // Calculate coach fee
    if (coach) {
      breakdown.coachFee = coach.hourlyRate * duration;
    }

    // Calculate totals
    breakdown.subtotal = breakdown.courtFee + breakdown.equipmentFee + breakdown.coachFee;
    breakdown.total = breakdown.subtotal;

    return breakdown;
  }

  /**
   * Apply a single pricing rule
   * @param {Object} rule - Pricing rule
   * @param {Object} context - Booking context
   * @returns {Number} Price adjustment
   */
  static applyRule(rule, { courtPrice, courtType, date, startTime }) {
    // Check if rule applies to this court type
    if (rule.appliesTo !== 'all' && rule.appliesTo !== courtType) {
      return 0;
    }

    const bookingDate = new Date(date);
    const dayOfWeek = bookingDate.getDay();
    const hour = parseInt(startTime.split(':')[0]);

    let isApplicable = false;

    switch (rule.type) {
      case 'peak_hour':
        // Check if booking time falls within peak hours
        if (rule.startTime && rule.endTime) {
          const ruleStart = parseInt(rule.startTime.split(':')[0]);
          const ruleEnd = parseInt(rule.endTime.split(':')[0]);
          isApplicable = hour >= ruleStart && hour < ruleEnd;
        }
        break;

      case 'weekend':
        // Check if it's a weekend (Saturday = 6, Sunday = 0)
        isApplicable = rule.applicableDays?.includes(dayOfWeek) || 
                       (dayOfWeek === 0 || dayOfWeek === 6);
        break;

      case 'holiday':
        // Check if the date is a holiday
        if (rule.specificDates && rule.specificDates.length > 0) {
          isApplicable = rule.specificDates.some(holidayDate => {
            const holiday = new Date(holidayDate);
            return holiday.toDateString() === bookingDate.toDateString();
          });
        }
        break;

      case 'indoor_premium':
        // Indoor court premium
        isApplicable = courtType === 'indoor';
        break;

      case 'early_bird':
        // Early morning discount
        if (rule.startTime && rule.endTime) {
          const ruleStart = parseInt(rule.startTime.split(':')[0]);
          const ruleEnd = parseInt(rule.endTime.split(':')[0]);
          isApplicable = hour >= ruleStart && hour < ruleEnd;
        }
        break;

      case 'custom':
        // Custom rules with day and time conditions
        const dayMatch = !rule.applicableDays?.length || rule.applicableDays.includes(dayOfWeek);
        let timeMatch = true;
        if (rule.startTime && rule.endTime) {
          const ruleStart = parseInt(rule.startTime.split(':')[0]);
          const ruleEnd = parseInt(rule.endTime.split(':')[0]);
          timeMatch = hour >= ruleStart && hour < ruleEnd;
        }
        isApplicable = dayMatch && timeMatch;
        break;
    }

    if (!isApplicable) {
      return 0;
    }

    // Calculate the adjustment based on modifier type
    switch (rule.modifierType) {
      case 'multiplier':
        return courtPrice * (rule.modifierValue - 1);
      case 'fixed_addition':
        return rule.modifierValue;
      case 'fixed_subtraction':
        return -rule.modifierValue;
      case 'percentage':
        return courtPrice * (rule.modifierValue / 100);
      default:
        return 0;
    }
  }

  /**
   * Calculate duration in hours
   * @param {String} startTime - Start time (HH:mm)
   * @param {String} endTime - End time (HH:mm)
   * @returns {Number} Duration in hours
   */
  static calculateDuration(startTime, endTime) {
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    
    return (endMinutes - startMinutes) / 60;
  }

  /**
   * Get all active pricing rules for display
   * @returns {Array} Active pricing rules
   */
  static async getActiveRules() {
    return await PricingRule.find({ isActive: true }).sort({ priority: -1 });
  }
}

module.exports = PricingEngine;
