module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('reviews', {
      review_id: {
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
      rating: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      review_text: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Add indexes
    await queryInterface.addIndex('reviews', ['user_id'], {
      name: 'reviews_user_id_index'
    });

    await queryInterface.addIndex('reviews', ['event_id'], {
      name: 'reviews_event_id_index'
    });

    await queryInterface.addIndex('reviews', ['rating'], {
      name: 'reviews_rating_index'
    });

    // Add unique constraint to prevent multiple reviews from same user for same event
    await queryInterface.addIndex('reviews', ['user_id', 'event_id'], {
      unique: true,
      name: 'reviews_user_event_unique'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('reviews');
  }
};