const Screen = require('../models/Screen');
const Event = require('../models/Event');

exports.getVenueScreens = async (req, res) => {
    try {
        const screens = await Screen.findAll({
            where: { venue_id: req.params.venueId },
            include: [{
                model: Event,
                as: 'events',
                where: {
                    event_date: {
                        [Op.gte]: new Date()
                    }
                },
                required: false
            }]
        });
        res.status(200).json(screens);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createScreen = async (req, res) => {
    try {
        const screen = await Screen.create(req.body);
        res.status(201).json(screen);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.updateScreen = async (req, res) => {
    try {
        const screen = await Screen.findByPk(req.params.id);
        if (!screen) {
            return res.status(404).json({ message: 'Screen not found' });
        }
        await screen.update(req.body);
        res.status(200).json(screen);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Add seat categories to a screen
const addSeatCategories = async (req, res) => {
    try {
        const { screenId } = req.params;
        const categories = req.body;

        // Validate screen exists
        const screen = await Screen.findByPk(screenId);
        if (!screen) {
            return res.status(404).json({ message: 'Screen not found' });
        }

        // Create categories
        const createdCategories = await SeatCategory.bulkCreate(
            categories.map(category => ({
                ...category,
                screen_id: screenId
            }))
        );

        res.status(201).json(createdCategories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update seat categories
const updateSeatCategories = async (req, res) => {
    try {
        const { screenId } = req.params;
        const categories = req.body;

        // Delete existing categories
        await SeatCategory.destroy({ where: { screen_id: screenId } });

        // Create new categories
        const updatedCategories = await SeatCategory.bulkCreate(
            categories.map(category => ({
                ...category,
                screen_id: screenId
            }))
        );

        res.status(200).json(updatedCategories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    addSeatCategories,
    updateSeatCategories
};