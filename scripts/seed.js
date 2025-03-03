require('dotenv').config();
const db = require('../config/database');
const seedUsers = require('../seeders/functions/userseeder');
const seedVenues = require('../seeders/functions/venueseeder');
const seedCategories = require('../seeders/functions/categoryseeder');
const seedScreens = require('../seeders/functions/screenseeder');
const seedEvents = require('../seeders/functions/eventseeder');
const seedSeats = require('../seeders/functions/seatseeder');
const seedBookings = require('../seeders/functions/bookingseeder');
const seedPayments = require('../seeders/functions/paymentseeder');

async function seedDatabase() {
    try {
        // Disable foreign key checks
        await db.query('SET FOREIGN_KEY_CHECKS = 0');

        // Drop tables sequentially in correct order
        await db.query('DROP TABLE IF EXISTS payments');
        await db.query('DROP TABLE IF EXISTS bookings');
        await db.query('DROP TABLE IF EXISTS seats');
        await db.query('DROP TABLE IF EXISTS show_times');
        await db.query('DROP TABLE IF EXISTS events');
        await db.query('DROP TABLE IF EXISTS screens');
        await db.query('DROP TABLE IF EXISTS users');
        await db.query('DROP TABLE IF EXISTS categories');
        await db.query('DROP TABLE IF EXISTS venues');

        // Enable foreign key checks
        await db.query('SET FOREIGN_KEY_CHECKS = 1');

        // Create tables
        await db.sync({ force: false });
        console.log('Database synced and tables created');

        // Seed in correct order
        const venues = await seedVenues();
        console.log(`Created ${venues.length} venues`);

        const categories = await seedCategories();
        console.log(`Created ${categories.length} categories`);

        const screens = await seedScreens(venues);
        console.log(`Created ${screens.length} screens`);

        const seats = await seedSeats(screens);
        console.log(`Created ${seats.length} seats`);

        const users = await seedUsers(venues);
        console.log(`Created ${users.length} users`);

        const events = await seedEvents(venues, screens, categories);
        console.log(`Created ${events.length} events`);

        const bookings = await seedBookings(users, events);
        console.log(`Created ${bookings.length} bookings`);

        const payments = await seedPayments(bookings);
        console.log(`Created ${payments.length} payments`);

        console.log('Database seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

seedDatabase();