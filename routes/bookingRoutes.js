const express = require('express');
const router = express.Router();
const {
  getBookings,
  createBooking,
  getBooking,
  updateBookingStatus,  // Changed from updateBooking
  deleteBooking
} = require('../controllers/bookingController');

router.route('/')
  .get(getBookings)
  .post(createBooking);

router.route('/:id')
  .get(getBooking)
  .put(updateBookingStatus)  // Changed from updateBooking
  .delete(deleteBooking);

module.exports = router;