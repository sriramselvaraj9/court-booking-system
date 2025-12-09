const Equipment = require('../models/Equipment');

// @desc    Get all equipment
// @route   GET /api/equipment
// @access  Public
const getEquipment = async (req, res) => {
  try {
    const { type, isActive } = req.query;
    const filter = {};
    
    if (type) filter.type = type;
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    const equipment = await Equipment.find(filter);
    res.json(equipment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single equipment item
// @route   GET /api/equipment/:id
// @access  Public
const getEquipmentItem = async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.params.id);
    if (!equipment) {
      return res.status(404).json({ message: 'Equipment not found' });
    }
    res.json(equipment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create equipment
// @route   POST /api/admin/equipment
// @access  Private/Admin
const createEquipment = async (req, res) => {
  try {
    const { name, type, description, totalQuantity, pricePerHour, image } = req.body;

    const equipment = await Equipment.create({
      name,
      type,
      description,
      totalQuantity,
      pricePerHour,
      image
    });

    res.status(201).json(equipment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update equipment
// @route   PUT /api/admin/equipment/:id
// @access  Private/Admin
const updateEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!equipment) {
      return res.status(404).json({ message: 'Equipment not found' });
    }

    res.json(equipment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete equipment
// @route   DELETE /api/admin/equipment/:id
// @access  Private/Admin
const deleteEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.findByIdAndDelete(req.params.id);

    if (!equipment) {
      return res.status(404).json({ message: 'Equipment not found' });
    }

    res.json({ message: 'Equipment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle equipment active status
// @route   PATCH /api/admin/equipment/:id/toggle
// @access  Private/Admin
const toggleEquipmentStatus = async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.params.id);

    if (!equipment) {
      return res.status(404).json({ message: 'Equipment not found' });
    }

    equipment.isActive = !equipment.isActive;
    await equipment.save();

    res.json(equipment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getEquipment,
  getEquipmentItem,
  createEquipment,
  updateEquipment,
  deleteEquipment,
  toggleEquipmentStatus
};
