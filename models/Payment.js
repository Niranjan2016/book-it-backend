const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Payment = sequelize.define('Payment', {
  payment_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  booking_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'bookings',
      key: 'booking_id'
    }
  },
  payment_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  payment_method: {
    type: DataTypes.ENUM('Credit Card', 'Debit Card', 'UPI', 'Net Banking'),
    allowNull: false
  },
  payment_status: {
    type: DataTypes.ENUM('Success', 'Failed', 'Refunded'),
    defaultValue: 'Success'
  }
}, {
  tableName: 'payments',
  timestamps: false
});

module.exports = Payment;