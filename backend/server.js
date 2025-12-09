const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Import middleware
let errorHandler, notFound;
try {
  const middleware = require('./middleware/errorHandler');
  errorHandler = middleware.errorHandler;
  notFound = middleware.notFound;
} catch (e) {
  errorHandler = (err, req, res, next) => res.status(500).json({ error: err.message });
  notFound = (req, res) => res.status(404).json({ message: 'Not found' });
}

const app = express();

// CORS
app.use(cors({ origin: '*' }));
app.use(express.json());

// MongoDB Connection
let isConnected = false;
const connectDB = async () => {
  if (isConnected) return;
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true;
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB error:', err.message);
    throw err;
  }
};

// DB Middleware
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(500).json({ error: 'Database connection failed', details: err.message });
  }
});

// Routes
try {
  app.use('/api/auth', require('./routes/authRoutes'));
  app.use('/api/courts', require('./routes/courtRoutes'));
  app.use('/api/coaches', require('./routes/coachRoutes'));
  app.use('/api/equipment', require('./routes/equipmentRoutes'));
  app.use('/api/bookings', require('./routes/bookingRoutes'));
  app.use('/api/pricing-rules', require('./routes/pricingRuleRoutes'));
  app.use('/api/admin', require('./routes/adminRoutes'));
} catch (e) {
  console.error('Route loading error:', e.message);
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', db: isConnected ? 'connected' : 'disconnected' });
});

app.get('/', (req, res) => {
  res.json({ message: 'Court Booking API', version: '1.0' });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

// Local dev
if (process.env.NODE_ENV !== 'production') {
  app.listen(process.env.PORT || 5000, () => console.log('Server running'));
}

module.exports = app;
