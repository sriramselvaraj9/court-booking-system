const Court = require('../models/Court');

// @desc    Get all courts
// @route   GET /api/courts
// @access  Public
const getCourts = async (req, res) => {
  try {
    const { type, isActive } = req.query;
    const filter = {};
    
    if (type) filter.type = type;
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    const courts = await Court.find(filter);
    res.json(courts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single court
// @route   GET /api/courts/:id
// @access  Public
const getCourt = async (req, res) => {
  try {
    const court = await Court.findById(req.params.id);
    if (!court) {
      return res.status(404).json({ message: 'Court not found' });
    }
    res.json(court);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create court
// @route   POST /api/admin/courts
// @access  Private/Admin
const createCourt = async (req, res) => {
  try {
    const { name, type, description, basePrice, amenities, image } = req.body;

    const court = await Court.create({
      name,
      type,
      description,
      basePrice,
      amenities,
      image
    });

    res.status(201).json(court);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update court
// @route   PUT /api/admin/courts/:id
// @access  Private/Admin
const updateCourt = async (req, res) => {
  try {
    const court = await Court.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!court) {
      return res.status(404).json({ message: 'Court not found' });
    }

    res.json(court);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete court
// @route   DELETE /api/admin/courts/:id
// @access  Private/Admin
const deleteCourt = async (req, res) => {
  try {
    const court = await Court.findByIdAndDelete(req.params.id);

    if (!court) {
      return res.status(404).json({ message: 'Court not found' });
    }

    res.json({ message: 'Court deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle court active status
// @route   PATCH /api/admin/courts/:id/toggle
// @access  Private/Admin
const toggleCourtStatus = async (req, res) => {
  try {
    const court = await Court.findById(req.params.id);

    if (!court) {
      return res.status(404).json({ message: 'Court not found' });
    }

    court.isActive = !court.isActive;
    await court.save();

    res.json(court);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCourts,
  getCourt,
  createCourt,
  updateCourt,
  deleteCourt,
  toggleCourtStatus
};
