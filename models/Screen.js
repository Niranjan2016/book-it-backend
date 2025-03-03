const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Screen extends Model {}

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
    }
}, {
    sequelize,
    modelName: 'Screen',
    tableName: 'screens',
    timestamps: false
});

module.exports = Screen;