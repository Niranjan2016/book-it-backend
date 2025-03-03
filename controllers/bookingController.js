const Booking = require('../models/Booking');
const Event = require('../models/Event');

// Get all bookings
exports.getBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll();
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user bookings
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      where: { user_id: req.params.userId }
    });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single booking
exports.getBooking = async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new booking
exports.createBooking = async (req, res) => {
  try {
    const event = await Event.findByPk(req.body.event_id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.available_seats < req.body.total_tickets) {
      return res.status(400).json({ message: 'Not enough seats available' });
    }

    const total_price = event.ticket_price * req.body.total_tickets;
    const booking = await Booking.create({
      ...req.body,
      total_price
    });

    // Update available seats
    await event.update({
      available_seats: event.available_seats - req.body.total_tickets
    });

    res.status(201).json(booking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update booking status
exports.updateBookingStatus = async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const oldStatus = booking.status;
    await booking.update({ status: req.body.status });

    // If booking is cancelled, return tickets to available seats
    if (req.body.status === 'Cancelled' && oldStatus !== 'Cancelled') {
      const event = await Event.findByPk(booking.event_id);
      await event.update({
        available_seats: event.available_seats + booking.total_tickets
      });
    }

    res.status(200).json(booking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete booking
exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    await booking.destroy();
    res.status(200).json({ message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};