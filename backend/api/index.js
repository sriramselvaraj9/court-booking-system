const express = require('express');
const cors = require('cors');
const connectDB = require('../config/db');
const { errorHandler, notFound } = require('../middleware/errorHandler');

// Route imports
const authRoutes = require('../routes/authRoutes');
const courtRoutes = require('../routes/courtRoutes');
const coachRoutes = require('../routes/coachRoutes');
const equipmentRoutes = require('../routes/equipmentRoutes');
const bookingRoutes = require('../routes/bookingRoutes');
const pricingRuleRoutes = require('../routes/pricingRuleRoutes');
const adminRoutes = require('../routes/adminRoutes');

const app = express();

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Connect to database before handling requests
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    res.status(500).json({ message: 'Database connection failed', error: error.message });
  }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/courts', courtRoutes);
app.use('/api/coaches', coachRoutes);
app.use('/api/equipment', equipmentRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/pricing-rules', pricingRuleRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Court Booking API is running' });
});

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Court Booking API - Use /api endpoints' });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

module.exports = app;
