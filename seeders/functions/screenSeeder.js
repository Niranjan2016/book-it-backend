const { faker } = require('@faker-js/faker');
const Screen = require('../../models/Screen');

async function seedScreens(venues) {
    const screens = [];
    const screenTypes = ['Standard', 'Premium', 'IMAX', 'VIP', '4DX', 'Gold Class'];

    for (const venue of venues) {
        // Skip non-cinema venues
        if (!venue.name.toLowerCase().includes('cinema') && 
            !venue.name.toLowerCase().includes('pvr') && 
            !venue.name.toLowerCase().includes('inox')) {
            continue;
        }

        // Determine number of screens based on venue type
        let numScreens;
        if (venue.name.toLowerCase().includes('multiplex')) {
            numScreens = faker.number.int({ min: 4, max: 6 });
        } else if (faker.number.int({ min: 1, max: 10 }) <= 2) {
            // 20% chance for single screen
            numScreens = 1;
        } else {
            numScreens = faker.number.int({ min: 3, max: 4 });
        }

        for (let i = 0; i < numScreens; i++) {
            const rows = faker.number.int({ min: 8, max: 15 });
            const seatsPerRow = faker.number.int({ min: 12, max: 20 });
            
            screens.push({
                venue_id: venue.venue_id,
                name: numScreens === 1 ? 
                    'Main Screen' : 
                    `${screenTypes[i % screenTypes.length]} Screen ${i + 1}`,
                capacity: rows * seatsPerRow,
                rows: rows,
                seats_per_row: seatsPerRow
            });
        }
    }

    try {
        await Screen.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
        await Screen.destroy({ where: {}, force: true });
        await Screen.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');

        const createdScreens = await Screen.bulkCreate(screens);
        console.log('Screens seeded successfully');
        return createdScreens;
    } catch (error) {
        console.error('Error seeding screens:', error);
        throw error;
    }
}

module.exports = seedScreens;