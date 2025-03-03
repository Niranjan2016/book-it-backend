const { DataTypes } = require('sequelize');
const db = require('../config/database');

const ShowTime = db.define('ShowTime', {
    showtime_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    event_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'events',
            key: 'event_id'
        }
    },
    show_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    screen_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'screens',
            key: 'screen_id'
        }
    },
    start_time: {
        type: DataTypes.TIME,
        allowNull: false
    },
    available_seats: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'show_times',
    timestamps: true
});

// Add associations
ShowTime.associate = (models) => {
    ShowTime.belongsTo(models.Event, {
        foreignKey: 'event_id',
        as: 'event'
    });
    ShowTime.belongsTo(models.Screen, {
        foreignKey: 'screen_id',
        as: 'screen'  // Add this alias
    });
};

module.exports = ShowTime;