module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('screens', {
      screen_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      venue_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'venues',
          key: 'venue_id'
        }
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      capacity: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      rows: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      seats_per_row: {
        type: Sequelize.INTEGER,
        allowNull: false
      }
    });

    await queryInterface.addIndex('screens', ['venue_id'], {
      name: 'screens_venue_id_index'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('screens');
  }
};