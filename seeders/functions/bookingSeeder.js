const { faker } = require('@faker-js/faker');
const Booking = require('../../models/Booking');

async function seedBookings(users, events) {
    const bookings = [];
    const regularUsers = users.filter(user => user.role === 'user');

    for (const event of events) {
        const numBookings = faker.number.int({ min: 5, max: 15 });
        
        for (let i = 0; i < numBookings; i++) {
            const user = regularUsers[Math.floor(Math.random() * regularUsers.length)];
            const numTickets = faker.number.int({ min: 1, max: 4 });
            
            bookings.push({
                user_id: user.user_id,
                event_id: event.event_id,
                total_tickets: numTickets,
                total_price: event.ticket_price * numTickets,
                booking_date: faker.date.recent(),
                status: faker.helpers.arrayElement(['confirmed', 'pending', 'cancelled'])
            });
        }
    }

    try {
        await Booking.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
        await Booking.destroy({ where: {}, force: true });
        await Booking.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');

        const createdBookings = await Booking.bulkCreate(bookings);
        console.log('Bookings seeded successfully');
        return createdBookings;
    } catch (error) {
        console.error('Error seeding bookings:', error);
        throw error;
    }
}

module.exports = seedBookings;