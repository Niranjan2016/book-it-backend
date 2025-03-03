module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('show_times', {
      showtime_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      event_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'events',
          key: 'event_id'
        }
      },
      show_date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      screen_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'screens',
          key: 'screen_id'
        }
      },
      start_time: {
        type: Sequelize.TIME,
        allowNull: false
      },
      available_seats: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });

    // Add indexes
    await queryInterface.addIndex('show_times', ['event_id'], {
      name: 'showtimes_event_id_index'
    });

    await queryInterface.addIndex('show_times', ['screen_id'], {
      name: 'showtimes_screen_id_index'
    });

    await queryInterface.addIndex('show_times', ['show_date', 'start_time'], {
      name: 'showtimes_datetime_index'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('show_times');
  }
};