const bcrypt = require('bcryptjs');
const { faker } = require('@faker-js/faker');
const User = require('../../models/User');

const indianFirstNames = [
    'Aarav', 'Aditya', 'Arjun', 'Arnav', 'Dev', 'Dhruv', 'Ishaan', 'Kabir', 'Krishna', 'Vihaan',
    'Aanya', 'Diya', 'Ishita', 'Kiara', 'Myra', 'Pari', 'Riya', 'Saanvi', 'Siya', 'Zara',
    'Rohan', 'Rahul', 'Amit', 'Priya', 'Neha', 'Meera', 'Raj', 'Ananya', 'Advait', 'Vivaan'
];

const indianLastNames = [
    'Patel', 'Shah', 'Kumar', 'Singh', 'Sharma', 'Verma', 'Gupta', 'Malhotra', 'Kapoor', 'Joshi',
    'Mehta', 'Desai', 'Chopra', 'Reddy', 'Nair', 'Iyer', 'Rao', 'Menon', 'Pillai', 'Shetty'
];

async function seedUsers(venues) {
    const users = [];
    const usedEmails = new Set();

    // Create superadmin
    users.push({
        full_name: 'Super Admin',
        email: 'superadmin@bookit.com',
        phone: '9876543210',
        password_hash: await bcrypt.hash('admin123', 10),
        role: 'superadmin'
    });

    // Create venue admins for each venue
    for (const venue of venues) {
        const firstName = indianFirstNames[Math.floor(Math.random() * indianFirstNames.length)];
        const lastName = indianLastNames[Math.floor(Math.random() * indianLastNames.length)];
        const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${venue.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`;

        users.push({
            full_name: `${firstName} ${lastName}`,
            email: email,
            phone: faker.phone.number('98########'),
            password_hash: await bcrypt.hash('venue123', 10),
            role: 'venue_admin',
            managed_venue_id: venue.venue_id
        });
    }

    // Create regular users
    for (let i = 0; i < 100; i++) {
        const firstName = indianFirstNames[Math.floor(Math.random() * indianFirstNames.length)];
        const lastName = indianLastNames[Math.floor(Math.random() * indianLastNames.length)];
        let email;
        let counter = 0;

        do {
            email = counter === 0 
                ? `${firstName.toLowerCase()}.${lastName.toLowerCase()}@gmail.com`
                : `${firstName.toLowerCase()}.${lastName.toLowerCase()}${counter}@gmail.com`;
            counter++;
        } while (usedEmails.has(email) && counter < 1000);

        if (counter >= 1000) continue;
        usedEmails.add(email);

        users.push({
            full_name: `${firstName} ${lastName}`,
            email: email,
            phone: faker.phone.number('98########'),
            password_hash: await bcrypt.hash('user123', 10),
            role: 'user'
        });
    }

    try {
        await User.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
        await User.destroy({ where: {}, force: true });
        await User.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');

        const createdUsers = await User.bulkCreate(users);
        console.log('Users seeded successfully');
        return createdUsers;
    } catch (error) {
        console.error('Error seeding users:', error);
        throw error;
    }
}

module.exports = seedUsers;