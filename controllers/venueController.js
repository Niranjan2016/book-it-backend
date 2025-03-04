const Venue = require('../models/Venue');
const Event = require('../models/Event');
const Category = require('../models/Category');
const Screen = require('../models/Screen');
const Seat = require('../models/Seat'); // Add this import
const { Op } = require('sequelize');
const path = require('path');

// Get all venues
const getVenues = async (req, res) => {
  console.log(req.user);
  try {
    const venues = await Venue.findAll({
      attributes: ['venue_id', 'name', 'address', 'capacity', 'description', 'image_url', 'images'],
      include: [{
        model: Event,
        as: 'events',
        attributes: [
          'event_id', 'event_name', 'event_date',
          'ticket_price', 'available_seats', 'image_url'
        ],
        include: [{
          model: Screen,
          as: 'screen',
          attributes: ['screen_id', 'name', 'capacity']
        }]
      }]
    });
    res.status(200).json(venues);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single venue
// Update getVenue function
const getVenue = async (req, res) => {
  try {
    const venue = await Venue.findByPk(req.params.id, {
      include: [{
        model: Event,
        as: 'events', // Changed from 'Events' to 'events' to match the model association
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        include: [{
          model: Category,
          as: 'category',
          attributes: ['category_id', 'name']
        }]
      }],
      attributes: {
        include: ['venue_id', 'name', 'address', 'city', 'capacity', 'description', 'image_url', 'images'],
        exclude: ['createdAt', 'updatedAt']
      }
    });

    if (!venue) {
      return res.status(404).json({
        success: false,
        message: 'Venue not found'
      });
    }
    res.status(200).json({
      success: true,
      data: venue
    });
  } catch (error) {
    console.error('Error fetching venue:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching venue details',
      error: error.message
    });
  }
};

// Create new venue
const createVenue = async (req, res) => {
  try {
    const { screens, ...venueData } = req.body;

    // Set default capacity as sum of all screen capacities
    venueData.capacity = screens.reduce((total, screen) => total + screen.capacity, 0);

    if (req.file) {
      venueData.image_url = `/uploads/venues/${req.file.filename}`;
    }

    if (req.files && req.files.length > 0) {
      venueData.images = req.files.map(file => `/uploads/venues/${file.filename}`);
    }

    // Add both admin_id and managed_venue_id
    venueData.admin_id = req.user.user_id;
    const venue = await Venue.create(venueData);

    // Update the user's managed_venue_id
    const User = require('../models/User');
    await User.update(
      { managed_venue_id: venue.venue_id },
      { where: { user_id: req.user.user_id } }
    );
    if (screens && Array.isArray(screens)) {
      // Create screens and their seats
      for (const screenData of screens) {
        const screen = await Screen.create({
          venue_id: venue.venue_id,
          name: screenData.name.trim(),
          capacity: screenData.capacity,
          rows: screenData.rows,
          seats_per_row: screenData.seats_per_row,
          status: 'active'
        });

        // Create seats for each row and column using letters
        const seatPromises = [];
        for (let row = 0; row < screenData.rows; row++) {
          const rowLetter = String.fromCharCode(65 + row); // Convert number to letter (A=65, B=66, etc.)
          for (let seatNum = 1; seatNum <= screenData.seats_per_row; seatNum++) {
            seatPromises.push(Seat.create({
              screen_id: screen.screen_id,
              row_number: rowLetter,
              seat_number: seatNum,
              status: 'available'
            }));
          }
        }
        await Promise.all(seatPromises);
      }

      // Fetch venue with screens and seats
      const venueWithScreens = await Venue.findByPk(venue.venue_id, {
        include: [{
          model: Screen,
          as: 'screens',
          attributes: ['screen_id', 'name', 'capacity', 'rows', 'seats_per_row', 'status'],
          include: [{
            model: Seat,
            as: 'seats',
            attributes: ['seat_id', 'row_number', 'seat_number', 'status']
          }]
        }]
      });

      res.status(201).json({
        success: true,
        message: 'Venue, screens, and seats created successfully',
        data: venueWithScreens
      });
    }
  } catch (error) {
    console.error('Error creating venue:', error);
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Update venue
const updateVenue = async (req, res) => {
  try {
    const venue = await Venue.findByPk(req.params.id);
    if (!venue) {
      return res.status(404).json({ message: 'Venue not found' });
    }

    console.log('Updating venue with data:', req.body);

    // Create uploads directory if it doesn't exist
    const fs = require('fs');
    const uploadDir = path.join(__dirname, '..', 'uploads', 'venues');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Keep the complete URL as is
    await venue.update(req.body);

    // Fetch updated venue
    const updatedVenue = await Venue.findByPk(req.params.id);
    res.status(200).json(updatedVenue);
  } catch (error) {
    console.error('Update error:', error);
    res.status(400).json({ message: error.message });
  }
};

// Delete venue
const deleteVenue = async (req, res) => {
  try {
    const venue = await Venue.findByPk(req.params.id);
    if (!venue) {
      return res.status(404).json({ message: 'Venue not found' });
    }
    await venue.destroy();
    res.status(200).json({ message: 'Venue deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Search venues by name or location

const searchVenues = async (req, res) => {
  try {
    const { query } = req.query;
    const venues = await Venue.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${query}%` } },
          { location: { [Op.like]: `%${query}%` } }
        ]
      }
    });
    res.status(200).json(venues);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get venues with pagination and filters
const getVenuesWithFilters = async (req, res) => {
  try {
    const { page = 1, limit = 10, minCapacity, maxCapacity } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = {};
    if (minCapacity) {
      whereClause.capacity = { [Op.gte]: minCapacity };
    }
    if (maxCapacity) {
      whereClause.capacity = { ...whereClause.capacity, [Op.lte]: maxCapacity };
    }

    const venues = await Venue.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.status(200).json({
      venues: venues.rows,
      totalPages: Math.ceil(venues.count / limit),
      currentPage: parseInt(page),
      totalVenues: venues.count
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Get venues with their events
// Get venues with events
// Change the function declaration to match other functions
const getVenuesWithEvents = async (req, res) => {
  try {
    const venues = await Venue.findAll({
      include: [
        {
          model: Event,
          as: 'events',
          include: [
            {
              model: Venue,
              as: 'venue'
            },
            {
              model: Screen,
              as: 'screen'
            }
          ],
          attributes: [
            'event_id', 'venue_id', 'event_name',
            'category_id', 'event_date', 'ticket_price',
            'available_seats', 'image_url', 'images'
          ]
        },
        {
          model: Screen,
          as: 'screens'
        }
      ]
    });
    res.status(200).json(venues);
  } catch (error) {
    console.error('Error in getVenuesWithEvents:', error);
    res.status(500).json({ message: error.message });
  }
};
// Added missing closing bracket
// Get screens for a specific venue
const getVenueScreens = async (req, res) => {
  try {
    const venue = await Venue.findByPk(req.params.id, {
      include: [{
        model: Screen,
        as: 'screens',
        attributes: ['screen_id', 'name', 'capacity', 'status']
      }]
    });

    if (!venue) {
      return res.status(404).json({ message: 'Venue not found' });
    }

    res.status(200).json(venue.screens);
  } catch (error) {
    console.error('Error fetching venue screens:', error);
    res.status(500).json({ message: error.message });
  }
};
// Get events for a specific venue
const getVenueEvents = async (req, res) => {
  try {
    const { venueId } = req.params;
    const venue = await Venue.findByPk(venueId, {
      include: [{
        model: Event,
        as: 'Events', // Changed to match the alias used in other functions
        include: [{
          model: Category,
          as: 'category',
          attributes: ['category_id', 'name']
        }]
      }]
    });

    if (!venue) {
      return res.status(404).json({ message: 'Venue not found' });
    }

    res.status(200).json(venue.Events); // Changed to match the alias
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Get venues for logged-in admin
const getAdminVenues = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (req.user.role !== 'venue_admin') {
      return res.status(403).json({ message: 'Access denied: Not a venue admin' });
    }

    const venues = await Venue.findAll({
      where: {
        venue_id: req.user.managed_venue_id // Filter by the venue ID the admin manages
      },
      include: [
        {
          model: Event,
          as: 'events',
          attributes: ['event_id', 'event_name', 'event_date']
        },
        {
          model: Screen,
          as: 'screens',
          attributes: ['screen_id', 'name', 'capacity', 'status']
        }
      ]
    });

    if (venues.length === 0) {
      return res.status(404).json({ message: 'No venues found for this admin' });
    }

    res.status(200).json(venues);
  } catch (error) {
    console.error('Error in getAdminVenues:', error);
    res.status(500).json({ message: error.message });
  }
};
// Add to module.exports
module.exports = {
  getVenues,
  getVenue,
  createVenue,
  updateVenue,
  deleteVenue,
  searchVenues,
  getVenuesWithFilters,
  getVenuesWithEvents,
  getVenueEvents,
  getAdminVenues,
  getVenueScreens
};