const express = require('express');
const router = express.Router();
const {
  getCourts,
  getCourt
} = require('../controllers/courtController');

router.get('/', getCourts);
router.get('/:id', getCourt);

module.exports = router;
