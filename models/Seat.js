const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Seat = sequelize.define('Seat', {
  seat_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  screen_id: {  // Changed from event_id to screen_id
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'screens',
      key: 'screen_id'
    }
  },
  row_number: {  // Added row_number field
    type: DataTypes.STRING(2), // Changed from INTEGER to STRING
    allowNull: false
  },
  seat_number: {
    type: DataTypes.INTEGER,  // Changed from STRING to INTEGER
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('available', 'booked', 'reserved'),  // Changed from BOOLEAN to ENUM
    defaultValue: 'available',
    allowNull: false
  },
}, {
  tableName: 'seats',
  timestamps: false
});

module.exports = Seat;