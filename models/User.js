const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  full_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password_hash: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('superadmin', 'venue_admin', 'user', 'venue_employee'),
    defaultValue: 'user',
    allowNull: false
  },
  managed_venue_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'venues',
      key: 'venue_id'
    }
  }
}, {
  tableName: 'users'
});

User.associate = function(models) {
  User.belongsTo(models.Venue, {
    foreignKey: 'managed_venue_id',
    as: 'managed_venue'
  });
};

module.exports = User;