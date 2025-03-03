const Event = require('../models/event');
const Category = require('../models/Category');
const Venue = require('../models/Venue');  // Add this import
const Screen = require('../models/Screen');
const { Op } = require('sequelize');
const ShowTime = require('../models/ShowTime');

// Update getEvent function to include show times
async function getEvent(req, res) {
    try {
        const event = await Event.findByPk(req.params.id, {
            include: [
                {
                    model: Category,
                    as: 'category',
                    attributes: ['category_id', 'name', 'description']
                },
                {
                    model: Venue,
                    as: 'venue',
                    attributes: ['venue_id', 'name', 'address']
                },
                {
                    model: Screen,
                    as: 'eventScreen',
                    attributes: ['screen_id', 'name', 'capacity', 'status']
                },
                {
                    model: ShowTime,
                    as: 'showTimes',
                    attributes: ['showtime_id', 'show_date', 'start_time', 'available_seats', 'screen_id'],
                    include: [{
                        model: Screen,
                        as: 'screen',
                        attributes: ['screen_id', 'name', 'capacity']
                    }]
                }
            ]
        });
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.status(200).json(event);
    } catch (error) {
        console.error('Error in getEvent:', error);
        res.status(500).json({ message: error.message });
    }
}

// Get single event
async function getEvent(req, res) {
    try {
        console.log('Fetching event with ID:', req.params.id);

        // First, check if show times exist for this event
        const showTimes = await ShowTime.findAll({
            where: { event_id: req.params.id },
            raw: true
        });
        console.log('Show times in database:', showTimes);

        const event = await Event.findByPk(req.params.id, {
            include: [
                {
                    model: Category,
                    as: 'category',
                    attributes: ['category_id', 'name', 'description']
                },
                {
                    model: Venue,
                    as: 'venue',
                    attributes: ['venue_id', 'name', 'address']
                },
                {
                    model: ShowTime,
                    as: 'showTimes',
                    separate: true, // Try loading show times separately
                    include: [{
                        model: Screen,
                        as: 'screen',
                        attributes: ['screen_id', 'name', 'capacity']
                    }]
                }
            ]
        });

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Debug log
        console.log('Show times in event:', event.showTimes);

        res.status(200).json(event);
    } catch (error) {
        console.error('Error in getEvent:', error);
        res.status(500).json({ message: error.message });
    }
}

// Update getAdminEvents similarly
const getAdminEvents = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        if (req.user.role !== 'venue_admin') {
            return res.status(403).json({ message: 'Access denied: Not a venue admin' });
        }

        if (!req.user.managed_venue_id) {
            return res.status(404).json({ message: 'No venue assigned to this admin' });
        }

        const currentDate = new Date();
        const events = await Event.findAll({
            where: { venue_id: req.user.managed_venue_id },
            include: [
                {
                    model: Category,
                    as: 'category',
                    attributes: ['category_id', 'name']
                },
                {
                    model: Screen,
                    as: 'eventScreen',
                    attributes: ['screen_id', 'name', 'capacity', 'status']
                },
                {
                    model: ShowTime,
                    as: 'showTimes',
                    attributes: ['showtime_id', 'show_date', 'start_time', 'available_seats']
                }
            ],
            attributes: {
                include: ['event_id', 'event_name', 'ticket_price']
            },
            order: [['event_date', 'ASC']]
        });

        const eventsWithStatus = events.map(event => {
            const eventData = event.toJSON();
            eventData.isUpcoming = new Date(event.event_date) > currentDate;
            return eventData;
        });

        res.status(200).json(eventsWithStatus);
    } catch (error) {
        console.error('Error in getAdminEvents:', error);
        res.status(500).json({ message: error.message });
    }
};

// Create new event
const createEvent = async (req, res) => {
    try {
        const { start_date, end_date, show_times, ...eventData } = req.body;

        // Debug the incoming data
        console.log('Received data:', {
            start_date,
            end_date,
            show_times,
            eventData
        });

        // Create the main event
        const event = await Event.create(eventData);

        // Parse show_times if it's a string
        const parsedShowTimes = typeof show_times === 'string' ?
            JSON.parse(show_times) : show_times;
        if (start_date && end_date && parsedShowTimes && Array.isArray(parsedShowTimes)) {
            const startDate = new Date(start_date);
            const endDate = new Date(end_date);
            const showTimeEntries = [];
            // Validate dates
            if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
                throw new Error('Invalid start_date or end_date');
            }

            console.log('startDate', startDate);

            // Create show time entries for each date
            for (let currentDate = new Date(startDate);
                currentDate <= endDate;
                currentDate = new Date(currentDate.setDate(currentDate.getDate() + 1))) {

                const formattedDate = new Date(currentDate.toISOString().split('T')[0]);
                console.log('parsedShowTimes', parsedShowTimes);
                parsedShowTimes.forEach(time => {
                    if (!time.screen_id || !time.start_time) {
                        throw new Error('Missing required show time data: screen_id or start_time');
                    }

                    showTimeEntries.push({
                        event_id: event.event_id,
                        show_date: formattedDate,
                        screen_id: time.screen_id,
                        start_time: time.start_time,
                        available_seats: time.available_seats || eventData.available_seats || 0
                    });
                });
            }

            console.log('Show time entries to create:', showTimeEntries);

            try {
                // Bulk create all show times
                const createdShowTimes = await ShowTime.bulkCreate(showTimeEntries, {
                    validate: true,
                    returning: true,
                    individualHooks: true // Enable hooks for each record
                });

                if (!createdShowTimes || createdShowTimes.length === 0) {
                    throw new Error('No show times were created');
                }

                console.log(`Successfully created ${createdShowTimes.length} show times`);
            } catch (showTimeError) {
                console.error('Show time creation error:', showTimeError);
                await event.destroy();
                throw new Error(`Failed to create show times: ${showTimeError.message}`);
            }
        } else {
            console.warn('Missing show time data:', { start_date, end_date, show_times });
        }

        // Fetch and verify created event with show times
        const createdEvent = await Event.findByPk(event.event_id, {
            include: [{
                model: ShowTime,
                as: 'showTimes',
                include: [{
                    model: Screen,
                    as: 'screen',  // Add the correct alias for Screen
                    attributes: ['screen_id', 'name']
                }]
            }]
        });

        if (!createdEvent.showTimes || createdEvent.showTimes.length === 0) {
            console.warn('No show times found after creation');
        }

        return res.status(201).json({
            success: true,
            message: 'Event created successfully',
            data: createdEvent
        });

    } catch (error) {
        console.error('Error in createEvent:', error);
        return res.status(500).json({
            success: false,
            message: 'Error creating event',
            error: error.message
        });
    }
};


// Update getEvents function to include show times 

// Update getEvents function
async function getEvents(req, res) {
    try {
        console.log('Starting getEvents...');
        const events = await Event.findAll({
            attributes: ['event_id', 'event_name', 'event_date', 'ticket_price', 'available_seats'],
            include: [
                {
                    model: Category,
                    as: 'category',
                    attributes: ['category_id', 'name'],
                    required: false
                },
                {
                    model: Venue,
                    as: 'venue',
                    attributes: ['venue_id', 'name', 'address'],
                    required: false
                },
                {
                    model: ShowTime,
                    as: 'showTimes',
                    attributes: ['showtime_id', 'show_date', 'start_time', 'available_seats'],
                    required: false,
                    include: [{
                        model: Screen,
                        as: 'screen',
                        attributes: ['screen_id', 'name', 'capacity']
                    }]
                }
            ]
        });
        console.log(`Successfully fetched ${events.length} events`);
        res.status(200).json(events);
    } catch (error) {
        console.error('Error in getEvents:', error);
        res.status(500).json({ message: error.message });
    }
}

// Update event
async function updateEvent(req, res) {
    try {
        const event = await Event.findByPk(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        const updateData = { ...req.body };

        // Handle image upload
        if (req.file) {
            updateData.image_url = `/uploads/events/${req.file.filename}`;
        }

        // Handle multiple images if needed
        if (req.files && req.files.length > 0) {
            updateData.images = req.files.map(file => `/uploads/events/${file.filename}`);
        }

        await event.update(updateData);

        // Fetch updated event
        const updatedEvent = await Event.findByPk(req.params.id);
        res.status(200).json(updatedEvent);
    } catch (error) {
        console.error('Error updating event:', error);
        res.status(400).json({ message: error.message });
    }
}

// Delete event
async function deleteEvent(req, res) {
    try {
        const event = await Event.findByPk(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        await event.destroy();
        res.status(200).json({ message: 'Event deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Update available seats
async function updateAvailableSeats(req, res) {
    try {
        const event = await Event.findByPk(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        if (event.available_seats + req.body.change < 0) {
            return res.status(400).json({ message: 'Not enough available seats' });
        }
        await event.update({
            available_seats: event.available_seats + req.body.change
        });
        res.status(200).json(event);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

// Add this function before the module.exports
async function getShowTimeSeats(req, res) {
    try {
        const { eventId, showTimeId } = req.params;

        const showTime = await ShowTime.findOne({
            where: {
                showtime_id: showTimeId,
                event_id: eventId
            },
            include: [
                {
                    model: Screen,
                    as: 'screen',
                    attributes: ['screen_id', 'name', 'capacity']
                },
                {
                    model: Event,
                    as: 'event',
                    attributes: ['event_id', 'event_name']
                }
            ]
        });

        if (!showTime) {
            return res.status(404).json({
                message: 'Show time not found for this event'
            });
        }

        res.status(200).json(showTime);
    } catch (error) {
        console.error('Error in getShowTimeSeats:', error);
        res.status(500).json({ message: error.message });
    }
}


// Search events
async function searchEvents(req, res) {
    try {
        const { query } = req.query;
        const events = await Event.findAll({
            where: {
                [Op.or]: [
                    { title: { [Op.like]: `%${query}%` } },
                    { description: { [Op.like]: `%${query}%` } }
                ]
            }
        });
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Get events with filters and pagination
async function getFilteredEvents(req, res) {
    try {
        const { page = 1, limit = 10, date, minPrice, maxPrice, venueId, categoryId } = req.query;
        const offset = (page - 1) * limit;

        let whereClause = {};
        if (date) whereClause.event_date = date;
        if (venueId) whereClause.venue_id = venueId;
        if (categoryId) whereClause.category_id = categoryId;
        if (minPrice) whereClause.ticket_price = { [Op.gte]: minPrice };
        if (maxPrice) {
            whereClause.ticket_price = {
                ...(whereClause.ticket_price || {}),
                [Op.lte]: maxPrice
            };
        }

        const events = await Event.findAndCountAll({
            where: whereClause,
            include: [{
                model: Category,
                as: 'category',
                attributes: ['category_id', 'name', 'description']
            }],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        res.status(200).json({
            events: events.rows,
            totalPages: Math.ceil(events.count / limit),
            currentPage: parseInt(page),
            totalEvents: events.count
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Move getEventsByCategory before the exports
async function getEventsByCategory(req, res) {
    try {
        const { categoryId } = req.params;
        const events = await Event.findAll({
            where: { category_id: categoryId },
            include: [
                {
                    model: Category,
                    as: 'category',
                    attributes: ['category_id', 'name', 'description']
                },
                {
                    model: Venue,
                    attributes: ['venue_id', 'name', 'address'],
                    as: 'venue'
                },
                {
                    model: Screen,
                    as: 'eventScreen',  // Added screen association with correct alias
                    attributes: ['screen_id', 'name', 'capacity', 'status']
                }
            ]
        });

        if (!events.length) {
            return res.status(404).json({ message: 'No events found for this category' });
        }

        res.status(200).json(events);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: error.message });
    }
}

// Update the module.exports to include the new function
module.exports = {
    getEvents,
    getEvent,
    createEvent,
    updateEvent,
    deleteEvent,
    updateAvailableSeats,
    searchEvents,
    getFilteredEvents,
    getEventsByCategory,
    getAdminEvents,
    getShowTimeSeats
};