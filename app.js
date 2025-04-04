

const express = require('express');
const path = require('path');
const cors = require('cors');
const fs = require('fs'); // Add this line
const app = express();

// Update CORS configuration
const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:5000', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Access-Control-Allow-Origin'],
  exposedHeaders: ['Content-Range', 'X-Content-Range']
};

// Apply CORS before any routes
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple logging middleware to debug requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  // console.log('Response:', res.data);
  next();
});

// Import all routes
const authRoutes = require('./routes/authroutes');
const venueRoutes = require('./routes/venueroutes');
const eventRoutes = require('./routes/eventroutes');
const seatRoutes = require('./routes/seatroutes');
const bookingRoutes = require('./routes/bookingroutes');
const orderRoutes = require('./routes/orderRoutes');

// Register API routes
app.use('/api/auth', authRoutes);
app.use('/api/venues', venueRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/seats', seatRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/orders', orderRoutes);

// Simple logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// File upload directories setup
const uploadDir = path.join(__dirname, 'uploads', 'venues');
const uploadDirEv = path.join(__dirname, 'uploads', 'events');
fs.mkdirSync(uploadDir, { recursive: true });
fs.mkdirSync(uploadDirEv, { recursive: true });

// Static file serving
app.use('/uploads', express.static('uploads'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

module.exports = app;