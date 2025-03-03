const { faker } = require('@faker-js/faker');
const Event = require('../../models/event');

const movieTitles = [
    'Pathaan', 'War', 'Jawan', 'Animal', 'Dunki', 'Tiger 3',
    'Oppenheimer', 'Barbie', 'Mission Impossible', 'John Wick 4'
];

async function seedEvents(venues, screens, categories) {
    const events = [];
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1);

    // Filter cinema venues
    const cinemaVenues = venues.filter(v =>
        v.name.toLowerCase().includes('cinema') ||
        v.name.toLowerCase().includes('pvr') ||
        v.name.toLowerCase().includes('inox')
    );

    for (const venue of cinemaVenues) {
        const venueScreens = screens.filter(s => s.venue_id === venue.venue_id);
        if (!venueScreens.length) continue;

        for (const screen of venueScreens) {
            const numMovies = faker.number.int({ min: 2, max: 4 });

            for (let i = 0; i < numMovies; i++) {
                const eventDate = faker.date.between({ from: startDate, to: endDate });

                events.push({
                    event_name: faker.helpers.arrayElement(movieTitles),
                    category_id: categories.find(c => c.name === 'Movies').category_id,
                    venue_id: venue.venue_id,
                    screen_id: screen.screen_id,
                    event_date: eventDate,
                    ticket_price: faker.number.int({ min: 150, max: 500 }),
                    available_seats: screen.capacity,
                    show_times: JSON.stringify(['10:00 AM', '2:00 PM', '6:00 PM', '9:00 PM'])
                });
            }
        }
    }

    try {
        await Event.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
        await Event.destroy({ where: {}, force: true });
        await Event.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');

        const createdEvents = await Event.bulkCreate(events);
        console.log('Events seeded successfully');
        return createdEvents;
    } catch (error) {
        console.error('Error seeding events:', error);
        throw error;
    }
}

module.exports = seedEvents;