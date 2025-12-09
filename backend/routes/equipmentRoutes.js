const express = require('express');
const router = express.Router();
const {
  getEquipment,
  getEquipmentItem
} = require('../controllers/equipmentController');

router.get('/', getEquipment);
router.get('/:id', getEquipmentItem);

module.exports = router;
