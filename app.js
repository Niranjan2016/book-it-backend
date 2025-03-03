

const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const app = express();

// Enable CORS and basic middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import all routes
const authRoutes = require('./routes/authroutes');
const venueRoutes = require('./routes/venueroutes');
const eventRoutes = require('./routes/eventroutes');
const seatRoutes = require('./routes/seatroutes');
const bookingRoutes = require('./routes/bookingroutes');

// Register API routes
app.use('/api/auth', authRoutes);
app.use('/api/venues', venueRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/seats', seatRoutes);
app.use('/api/bookings', bookingRoutes);

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