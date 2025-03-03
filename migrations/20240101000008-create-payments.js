module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('payments', {
      payment_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      booking_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'bookings',
          key: 'booking_id'
        }
      },
      payment_date: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      payment_method: {
        type: Sequelize.ENUM('Credit Card', 'Debit Card', 'UPI', 'Net Banking'),
        allowNull: false
      },
      payment_status: {
        type: Sequelize.ENUM('Success', 'Failed', 'Refunded'),
        defaultValue: 'Success'
      }
    });

    // Add indexes
    await queryInterface.addIndex('payments', ['booking_id'], {
      name: 'payments_booking_id_index'
    });

    await queryInterface.addIndex('payments', ['payment_status'], {
      name: 'payments_status_index'
    });

    await queryInterface.addIndex('payments', ['payment_date'], {
      name: 'payments_date_index'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('payments');
  }
};