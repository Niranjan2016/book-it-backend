const { faker } = require('@faker-js/faker');
const ShowTime = require('../../models/ShowTime');

async function seedShowTimes(events, screens) {
    const showTimes = [];
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1);

    for (const event of events) {
        const screen = screens.find(s => s.screen_id === event.screen_id);
        if (!screen) continue;

        const numDays = faker.number.int({ min: 3, max: 7 });
        for (let day = 0; day < numDays; day++) {
            const showDate = faker.date.between({ from: startDate, to: endDate });
            
            // Different show times based on event type
            const timeSlots = event.category_id === 1 ? // Movies
                ['10:00:00', '13:30:00', '16:30:00', '19:30:00', '22:30:00'] :
                ['19:00:00']; // Other events

            for (const time of timeSlots) {
                showTimes.push({
                    event_id: event.event_id,
                    show_date: showDate,
                    screen_id: screen.screen_id,
                    start_time: time,
                    available_seats: screen.capacity
                });
            }
        }
    }

    try {
        await ShowTime.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
        await ShowTime.destroy({ where: {}, force: true });
        await ShowTime.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');

        const createdShowTimes = await ShowTime.bulkCreate(showTimes);
        console.log('ShowTimes seeded successfully');
        return createdShowTimes;
    } catch (error) {
        console.error('Error seeding show times:', error);
        throw error;
    }
}

module.exports = seedShowTimes;