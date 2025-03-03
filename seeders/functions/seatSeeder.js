const { faker } = require('@faker-js/faker');
const Seat = require('../../models/Seat');

async function seedSeats(screens) {
    const seats = [];

    for (const screen of screens) {
        // Get venue type from screen name
        const isMovieScreen = screen.name.toLowerCase().includes('screen');
        const maxSeats = isMovieScreen ? 150 : 500;

        // Calculate rows and seats based on venue type
        let totalRows, seatsPerRow;
        if (isMovieScreen) {
            totalRows = faker.number.int({ min: 10, max: 15 });
            seatsPerRow = Math.min(Math.floor(maxSeats / totalRows), 15);
        } else {
            totalRows = faker.number.int({ min: 20, max: 25 });
            seatsPerRow = Math.min(Math.floor(maxSeats / totalRows), 25);
        }

        // Create seats for each row
        for (let row = 1; row <= totalRows; row++) {
            for (let seatNum = 1; seatNum <= seatsPerRow; seatNum++) {
                seats.push({
                    screen_id: screen.screen_id,
                    row_number: row,
                    seat_number: seatNum,
                    status: 'available'
                });
            }
        }
    }

    try {
        await Seat.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
        await Seat.destroy({ where: {}, force: true });
        await Seat.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');

        const createdSeats = await Seat.bulkCreate(seats);
        console.log('Seats seeded successfully');
        return createdSeats;
    } catch (error) {
        console.error('Error seeding seats:', error);
        throw error;
    }
}

module.exports = seedSeats;