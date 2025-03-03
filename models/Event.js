const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Event extends Model { }

Event.init({
    event_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    event_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'categories',
            key: 'category_id'
        }
    },
    venue_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'venues',
            key: 'venue_id'
        }
    },
    screen_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'screens',
            key: 'screen_id'
        }
    },
    event_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    ticket_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    available_seats: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    show_times: {
        type: DataTypes.TEXT,
        allowNull: false
    },

    image_url: {
        type: DataTypes.STRING,
        allowNull: true
    },
    images: {
        type: DataTypes.JSON,
        allowNull: true
    }
}, {
    sequelize,
    modelName: 'Event',
    tableName: 'events',
    timestamps: false
});

module.exports = Event;

Event.associate = (models) => {
    Event.belongsTo(models.Category, {
        foreignKey: 'category_id',
        as: 'category'
    });
    Event.belongsTo(models.Venue, {
        foreignKey: 'venue_id',
        as: 'venue'
    });
    Event.belongsTo(models.Screen, {
        foreignKey: 'screen_id',
        as: 'eventScreen'
    });
    // Update ShowTime association
    Event.hasMany(models.ShowTime, {
        foreignKey: 'event_id',
        as: 'showTimes',
        onDelete: 'CASCADE'
    });
};