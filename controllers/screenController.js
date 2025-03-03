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