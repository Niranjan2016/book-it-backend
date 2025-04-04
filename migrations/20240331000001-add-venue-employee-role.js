module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      ALTER TABLE users 
      MODIFY COLUMN role ENUM('superadmin', 'venue_admin', 'user', 'venue_employee') 
      NOT NULL DEFAULT 'user';
    `);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      ALTER TABLE users 
      MODIFY COLUMN role ENUM('superadmin', 'venue_admin', 'user') 
      NOT NULL DEFAULT 'user';
    `);
  }
};