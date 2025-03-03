module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('events', {
      event_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      event_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      category_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'categories',
          key: 'category_id'
        }
      },
      venue_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'venues',
          key: 'venue_id'
        }
      },
      screen_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'screens',
          key: 'screen_id'
        }
      },
      event_date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      ticket_price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      available_seats: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      show_times: {
        type: Sequelize.TEXT,
        allowNull: false
      }
    });

    // Add indexes for performance
    await queryInterface.addIndex('events', ['category_id'], {
      name: 'events_category_id_index'
    });

    await queryInterface.addIndex('events', ['venue_id'], {
      name: 'events_venue_id_index'
    });

    await queryInterface.addIndex('events', ['screen_id'], {
      name: 'events_screen_id_index'
    });

    await queryInterface.addIndex('events', ['event_date'], {
      name: 'events_date_index'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('events');
  }
};