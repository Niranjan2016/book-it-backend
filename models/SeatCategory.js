const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SeatCategory = sequelize.define('SeatCategory', {
    category_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    screen_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price_multiplier: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 1.0
    },
    rows_from: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    rows_to: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    seats_per_row: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    position: {
        type: DataTypes.ENUM('FRONT', 'MIDDLE', 'BACK'),
        allowNull: false
    }
});

module.exports = SeatCategory;