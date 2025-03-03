const { faker } = require('@faker-js/faker');
const Venue = require('../../models/Venue');

async function seedVenues() {
    const venues = [];
    const cinemaChains = ['PVR', 'INOX', 'Cinepolis', 'City Pride', 'E-Square', 'Victory'];
    const puneAreas = ['Aundh', 'Baner', 'Kothrud', 'Hadapsar', 'Hinjewadi', 'Viman Nagar', 'Shivaji Nagar', 'Camp', 'Kharadi', 'Wakad', 'Pimpri', 'Chinchwad', 'Deccan', 'Swargate', 'Katraj'];
    
    // Create cinema halls (80% of total)
    for (let i = 0; i < 80; i++) {
        const area = puneAreas[Math.floor(Math.random() * puneAreas.length)];
        const chain = cinemaChains[Math.floor(Math.random() * cinemaChains.length)];
        
        venues.push({
            name: `${chain} Cinemas - ${area}`,
            address: `${faker.location.streetAddress()}, ${area}`,
            city: 'Pune',
            capacity: faker.number.int({ min: 300, max: 1000 }),
            description: `${chain} multiplex featuring state-of-the-art screens and premium viewing experience`,
            image_url: faker.image.urlLoremFlickr({ category: 'cinema' })
        });
    }

    // Create other venues (20% of total)
    const otherVenueTypes = ['Auditorium', 'Theater', 'Stadium', 'Concert Hall'];
    for (let i = 0; i < 20; i++) {
        const area = puneAreas[Math.floor(Math.random() * puneAreas.length)];
        const venueType = otherVenueTypes[Math.floor(Math.random() * otherVenueTypes.length)];
        
        venues.push({
            name: `${faker.company.name()} ${venueType}`,
            address: `${faker.location.streetAddress()}, ${area}`,
            city: 'Pune',
            capacity: faker.number.int({ min: 500, max: 2000 }),
            description: faker.company.catchPhrase(),
            image_url: faker.image.urlLoremFlickr({ category: 'venue' })
        });
    }

    try {
        await Venue.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
        await Venue.destroy({ where: {}, force: true });
        await Venue.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');

        const createdVenues = await Venue.bulkCreate(venues);
        console.log('Venues seeded successfully');
        return createdVenues;
    } catch (error) {
        console.error('Error seeding venues:', error);
        throw error;
    }
}

module.exports = seedVenues;