module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('seats', {
      seat_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      screen_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'screens',
          key: 'screen_id'
        }
      },
      row_number: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      seat_number: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('available', 'booked', 'reserved'),
        defaultValue: 'available',
        allowNull: false
      }
    });

    // Add indexes
    await queryInterface.addIndex('seats', ['screen_id'], {
      name: 'seats_screen_id_index'
    });

    await queryInterface.addIndex('seats', ['status'], {
      name: 'seats_status_index'
    });

    // Add composite index for seat location
    await queryInterface.addIndex('seats', ['screen_id', 'row_number', 'seat_number'], {
      unique: true,
      name: 'seats_location_unique'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('seats');
  }
};