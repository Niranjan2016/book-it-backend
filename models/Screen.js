const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');
const SeatCategory = require('./SeatCategory'); // Add this import
const Seat = require('./Seat'); // Add this import

class Screen extends Model { }

Screen.init({
    screen_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    venue_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'venues',
            key: 'venue_id'
        }
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    capacity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    rows: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    seats_per_row: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('active', 'inactive', 'maintenance'),
        defaultValue: 'active',
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'Screen',
    tableName: 'screens',
    timestamps: false
});
// Add to your existing Screen model
Screen.hasMany(SeatCategory, {
    foreignKey: 'screen_id',
    as: 'seatCategories'
});
Screen.hasMany(Seat, {
    foreignKey: 'screen_id',
    as: 'screenSeats'  // Changed alias from 'seats' to 'screenSeats'
});

module.exports = Screen;