const Coach = require('../models/Coach');

// @desc    Get all coaches
// @route   GET /api/coaches
// @access  Public
const getCoaches = async (req, res) => {
  try {
    const { isActive } = req.query;
    const filter = {};
    
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    const coaches = await Coach.find(filter);
    res.json(coaches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single coach
// @route   GET /api/coaches/:id
// @access  Public
const getCoach = async (req, res) => {
  try {
    const coach = await Coach.findById(req.params.id);
    if (!coach) {
      return res.status(404).json({ message: 'Coach not found' });
    }
    res.json(coach);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create coach
// @route   POST /api/admin/coaches
// @access  Private/Admin
const createCoach = async (req, res) => {
  try {
    const { name, email, phone, specialization, experience, hourlyRate, bio, image, availability } = req.body;

    const coach = await Coach.create({
      name,
      email,
      phone,
      specialization,
      experience,
      hourlyRate,
      bio,
      image,
      availability
    });

    res.status(201).json(coach);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update coach
// @route   PUT /api/admin/coaches/:id
// @access  Private/Admin
const updateCoach = async (req, res) => {
  try {
    const coach = await Coach.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!coach) {
      return res.status(404).json({ message: 'Coach not found' });
    }

    res.json(coach);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete coach
// @route   DELETE /api/admin/coaches/:id
// @access  Private/Admin
const deleteCoach = async (req, res) => {
  try {
    const coach = await Coach.findByIdAndDelete(req.params.id);

    if (!coach) {
      return res.status(404).json({ message: 'Coach not found' });
    }

    res.json({ message: 'Coach deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle coach active status
// @route   PATCH /api/admin/coaches/:id/toggle
// @access  Private/Admin
const toggleCoachStatus = async (req, res) => {
  try {
    const coach = await Coach.findById(req.params.id);

    if (!coach) {
      return res.status(404).json({ message: 'Coach not found' });
    }

    coach.isActive = !coach.isActive;
    await coach.save();

    res.json(coach);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update coach availability
// @route   PUT /api/admin/coaches/:id/availability
// @access  Private/Admin
const updateCoachAvailability = async (req, res) => {
  try {
    const { availability } = req.body;
    const coach = await Coach.findById(req.params.id);

    if (!coach) {
      return res.status(404).json({ message: 'Coach not found' });
    }

    coach.availability = new Map(Object.entries(availability));
    await coach.save();

    res.json(coach);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCoaches,
  getCoach,
  createCoach,
  updateCoach,
  deleteCoach,
  toggleCoachStatus,
  updateCoachAvailability
};
