const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Event = require('./Event');
const ShowTime = require('./ShowTime');
const Booking = require('./Booking');

class Order extends Model {}

Order.init({
    order_id: {
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
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    event_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    showtime_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    total_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    seat_numbers: {
        type: DataTypes.JSON,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('pending', 'confirmed', 'cancelled'),
        defaultValue: 'pending'
    },
    payment_status: {
        type: DataTypes.ENUM('pending', 'completed', 'failed'),
        defaultValue: 'pending'
    }
}, {
    sequelize,
    modelName: 'Order',
    tableName: 'orders',
    timestamps: true,
    underscored: true
});

const initAssociations = () => {
    Order.belongsTo(Booking, {
        foreignKey: 'booking_id',
        as: 'booking'
    });

    Order.belongsTo(User, {
        foreignKey: 'user_id',
        as: 'user'
    });

    Order.belongsTo(Event, {
        foreignKey: 'event_id',
        as: 'event'
    });

    Order.belongsTo(ShowTime, {
        foreignKey: 'showtime_id',
        as: 'showTime'
    });
};

setTimeout(initAssociations, 0);

module.exports = Order;