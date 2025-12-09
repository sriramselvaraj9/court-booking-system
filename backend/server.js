const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

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
  }
};

// Connect to DB on startup
connectDB();

// DB Middleware
app.use(async (req, res, next) => {
  if (!isConnected) {
    try {
      await connectDB();
    } catch (err) {
      return res.status(500).json({ error: 'Database connection failed' });
    }
  }
  next();
});

// Import and use routes
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
app.use((req, res) => res.status(404).json({ message: 'Not found' }));
app.use((err, req, res, next) => res.status(500).json({ error: err.message }));

// ALWAYS listen on port - required for Render
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log('Server running on port ' + PORT);
});
