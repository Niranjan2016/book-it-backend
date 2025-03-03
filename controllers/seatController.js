const Seat = require('../models/Seat');
const Screen = require('../models/Screen');
const ShowTime = require('../models/ShowTime');

// Generate seat layout for a screen
exports.generateScreenSeats = async (req, res) => {
    try {
        const { screenId } = req.params;
        const screen = await Screen.findByPk(screenId);
        
        if (!screen) {
            return res.status(404).json({ message: 'Screen not found' });
        }

        const capacity = screen.capacity;
        const seatsPerRow = 10; // Standard seats per row
        const numberOfRows = Math.ceil(capacity / seatsPerRow);
        const seats = [];

        // Generate seats with alphabetic row numbers (A, B, C...) and numeric seat numbers
        for (let i = 0; i < numberOfRows; i++) {
            const rowLetter = String.fromCharCode(65 + i); // 65 is ASCII for 'A'
            const seatsInThisRow = i === numberOfRows - 1 ? capacity % seatsPerRow || seatsPerRow : seatsPerRow;

            for (let j = 1; j <= seatsInThisRow; j++) {
                seats.push({
                    screen_id: screenId,
                    row: rowLetter,
                    seat_number: j,
                    status: 'available',
                    category: 'standard', // Can be premium, standard, etc.
                    price_multiplier: 1.0 // For different pricing tiers
                });
            }
        }

        // Bulk create all seats
        await Seat.bulkCreate(seats);

        res.status(201).json({
            message: 'Seats generated successfully',
            seatCount: seats.length,
            layout: {
                rows: numberOfRows,
                seatsPerRow,
                totalSeats: capacity
            }
        });
    } catch (error) {
        console.error('Error generating seats:', error);
        res.status(500).json({ message: error.message });
    }
};

// Get seat layout for a screen
exports.getScreenLayout = async (req, res) => {
    try {
        const { screenId } = req.params;
        const seats = await Seat.findAll({
            where: { screen_id: screenId },
            order: [
                ['row', 'ASC'],
                ['seat_number', 'ASC']
            ]
        });

        // Transform into layout format
        const layout = seats.reduce((acc, seat) => {
            if (!acc[seat.row]) {
                acc[seat.row] = [];
            }
            acc[seat.row].push({
                id: seat.seat_id,
                number: seat.seat_number,
                status: seat.status,
                category: seat.category
            });
            return acc;
        }, {});

        res.status(200).json({
            screenId,
            layout,
            totalSeats: seats.length
        });
    } catch (error) {
        console.error('Error fetching seat layout:', error);
        res.status(500).json({ message: error.message });
    }
};

// Get available seats for a showtime
exports.getShowtimeSeats = async (req, res) => {
    try {
        const { eventId, showTimeId } = req.params;
        
        // First get the showtime to get the screen_id
        const showtime = await ShowTime.findOne({
            where: {
                showtime_id: showTimeId,
                event_id: eventId
            }
        });

        if (!showtime) {
            return res.status(404).json({ message: 'Showtime not found' });
        }

        const seats = await Seat.findAll({
            where: {
                screen_id: showtime.screen_id,
                status: 'available'
            },
            order: [
                ['row', 'ASC'],
                ['seat_number', 'ASC']
            ]
        });

        // Transform into layout format
        const layout = seats.reduce((acc, seat) => {
            if (!acc[seat.row]) {
                acc[seat.row] = [];
            }
            acc[seat.row].push({
                id: seat.seat_id,
                number: seat.seat_number,
                status: seat.status,
                category: seat.category,
                price: seat.price_multiplier
            });
            return acc;
        }, {});

        res.status(200).json({
            eventId,
            showTimeId,
            layout,
            availableSeats: seats.length
        });
    } catch (error) {
        console.error('Error fetching showtime seats:', error);
        res.status(500).json({ message: error.message });
    }
};

// Get all seats
exports.getSeats = async (req, res) => {
    try {
        const seats = await Seat.findAll();
        res.status(200).json(seats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get available seats
exports.getAvailableSeats = async (req, res) => {
    try {
        const { venueId, eventId } = req.query;
        const seats = await Seat.findAll({
            where: {
                venueId,
                status: 'available'
            }
        });
        res.status(200).json(seats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get single seat
exports.getSeat = async (req, res) => {
    try {
        const seat = await Seat.findByPk(req.params.id);
        if (!seat) {
            return res.status(404).json({ message: 'Seat not found' });
        }
        res.status(200).json(seat);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create new seat
exports.createSeat = async (req, res) => {
    try {
        const seat = await Seat.create(req.body);
        res.status(201).json(seat);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update seat
exports.updateSeat = async (req, res) => {
    try {
        const seat = await Seat.findByPk(req.params.id);
        if (!seat) {
            return res.status(404).json({ message: 'Seat not found' });
        }
        await seat.update(req.body);
        res.status(200).json(seat);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete seat
exports.deleteSeat = async (req, res) => {
    try {
        const seat = await Seat.findByPk(req.params.id);
        if (!seat) {
            return res.status(404).json({ message: 'Seat not found' });
        }
        await seat.destroy();
        res.status(200).json({ message: 'Seat deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Book a seat
exports.bookSeat = async (req, res) => {
  try {
    const seat = await Seat.findByPk(req.params.id);
    if (!seat) {
      return res.status(404).json({ message: 'Seat not found' });
    }
    if (seat.is_booked) {
      return res.status(400).json({ message: 'Seat is already booked' });
    }
    await seat.update({ is_booked: true });
    res.status(200).json({ message: 'Seat booked successfully', seat });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};