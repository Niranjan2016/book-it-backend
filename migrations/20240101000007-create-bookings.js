module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('bookings', {
      booking_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'user_id'
        }
      },
      event_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'events',
          key: 'event_id'
        }
      },
      total_tickets: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      total_price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      booking_date: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      status: {
        type: Sequelize.ENUM('pending', 'confirmed', 'cancelled'),
        defaultValue: 'pending',
        allowNull: false
      }
    });

    // Add indexes
    await queryInterface.addIndex('bookings', ['user_id'], {
      name: 'bookings_user_id_index'
    });

    await queryInterface.addIndex('bookings', ['event_id'], {
      name: 'bookings_event_id_index'
    });

    await queryInterface.addIndex('bookings', ['status'], {
      name: 'bookings_status_index'
    });

    await queryInterface.addIndex('bookings', ['booking_date'], {
      name: 'bookings_date_index'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('bookings');
  }
};