const express = require('express');
const router = express.Router();
const seatController = require('../controllers/seatcontroller');

// Event and showtime seat routes
router.get('/events/:eventId/show-times/:showTimeId', seatController.getShowtimeSeats);

// Screen management routes
router.post('/screens/:screenId/generate', seatController.generateScreenSeats);
router.get('/screens/:screenId/layout', seatController.getScreenLayout);

module.exports = router;