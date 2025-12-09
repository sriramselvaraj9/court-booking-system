const express = require('express');
const router = express.Router();
const {
  getCoaches,
  getCoach
} = require('../controllers/coachController');

router.get('/', getCoaches);
router.get('/:id', getCoach);

module.exports = router;
