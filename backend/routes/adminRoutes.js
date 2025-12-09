const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');

// Court management
const {
  createCourt,
  updateCourt,
  deleteCourt,
  toggleCourtStatus
} = require('../controllers/courtController');

// Coach management
const {
  createCoach,
  updateCoach,
  deleteCoach,
  toggleCoachStatus,
  updateCoachAvailability
} = require('../controllers/coachController');

// Equipment management
const {
  createEquipment,
  updateEquipment,
  deleteEquipment,
  toggleEquipmentStatus
} = require('../controllers/equipmentController');

// Pricing rule management
const {
  createPricingRule,
  updatePricingRule,
  deletePricingRule,
  togglePricingRuleStatus
} = require('../controllers/pricingRuleController');

// Apply protection to all admin routes
router.use(protect, admin);

// Court routes
router.post('/courts', createCourt);
router.put('/courts/:id', updateCourt);
router.delete('/courts/:id', deleteCourt);
router.patch('/courts/:id/toggle', toggleCourtStatus);

// Coach routes
router.post('/coaches', createCoach);
router.put('/coaches/:id', updateCoach);
router.delete('/coaches/:id', deleteCoach);
router.patch('/coaches/:id/toggle', toggleCoachStatus);
router.put('/coaches/:id/availability', updateCoachAvailability);

// Equipment routes
router.post('/equipment', createEquipment);
router.put('/equipment/:id', updateEquipment);
router.delete('/equipment/:id', deleteEquipment);
router.patch('/equipment/:id/toggle', toggleEquipmentStatus);

// Pricing rule routes
router.post('/pricing-rules', createPricingRule);
router.put('/pricing-rules/:id', updatePricingRule);
router.delete('/pricing-rules/:id', deletePricingRule);
router.patch('/pricing-rules/:id/toggle', togglePricingRuleStatus);

module.exports = router;
