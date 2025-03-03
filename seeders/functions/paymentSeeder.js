const { faker } = require('@faker-js/faker');
const Payment = require('../../models/Payment');

async function seedPayments(bookings) {
    const payments = [];
    const paymentMethods = ['Credit Card', 'Debit Card', 'UPI', 'Net Banking'];

    for (const booking of bookings) {
        // Only create payments for confirmed bookings
        if (booking.status === 'confirmed') {
            payments.push({
                booking_id: booking.booking_id,
                payment_date: faker.date.between({ 
                    from: booking.booking_date, 
                    to: new Date(booking.booking_date.getTime() + 24 * 60 * 60 * 1000) 
                }),
                amount: booking.total_price,
                payment_method: faker.helpers.arrayElement(paymentMethods),
                payment_status: 'Success'
            });
        }
    }

    try {
        await Payment.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
        await Payment.destroy({ where: {}, force: true });
        await Payment.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');

        const createdPayments = await Payment.bulkCreate(payments);
        console.log('Payments seeded successfully');
        return createdPayments;
    } catch (error) {
        console.error('Error seeding payments:', error);
        throw error;
    }
}

module.exports = seedPayments;