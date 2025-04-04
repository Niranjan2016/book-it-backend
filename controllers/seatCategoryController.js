const SeatCategory = require('../models/SeatCategory');
const Screen = require('../models/Screen');

async function createSeatCategories(req, res) {
    try {
        const { screenId } = req.params;
        const categories = req.body;

        // Validate screen exists
        const screen = await Screen.findByPk(screenId);
        if (!screen) {
            return res.status(404).json({ message: 'Screen not found' });
        }

        // Validate categories
        const sortedCategories = categories.sort((a, b) => a.rows_from - b.rows_from);
        for (let i = 1; i < sortedCategories.length; i++) {
            if (sortedCategories[i].rows_from <= sortedCategories[i-1].rows_to) {
                return res.status(400).json({ message: 'Seat categories have overlapping rows' });
            }
        }

        // Create categories
        const createdCategories = await SeatCategory.bulkCreate(
            categories.map(cat => ({
                ...cat,
                screen_id: screenId
            }))
        );

        res.status(201).json(createdCategories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function getSeatCategories(req, res) {
    try {
        const { screenId } = req.params;
        const categories = await SeatCategory.findAll({
            where: { screen_id: screenId },
            order: [['rows_from', 'ASC']]
        });
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    createSeatCategories,
    getSeatCategories
};