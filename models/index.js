const User = require('./User');
const Venue = require('./Venue');
const Event = require('./event');
const Category = require('./Category');
const Screen = require('./Screen');
const Seat = require('./Seat');
const Booking = require('./Booking');
const Review = require('./Review');
const Payment = require('./Payment');
const ShowTime = require('./ShowTime');

// Define associations
Venue.hasMany(Screen, {
    foreignKey: 'venue_id',
    as: 'screens'
});

Screen.belongsTo(Venue, {
    foreignKey: 'venue_id',
    as: 'venue'
});

Event.belongsTo(Venue, {
    foreignKey: 'venue_id',
    as: 'venue'
});

Venue.hasMany(Event, {
    foreignKey: 'venue_id',
    as: 'events'
});

Category.hasMany(Event, {
    foreignKey: 'category_id',
    as: 'events'
});

Event.belongsTo(Category, {
    foreignKey: 'category_id',
    as: 'category'
});

Event.belongsTo(Screen, {
    foreignKey: 'screen_id',
    as: 'screen'
});

Screen.hasMany(Seat, {
    foreignKey: 'screen_id',
    as: 'seats'
});

Seat.belongsTo(Screen, {
    foreignKey: 'screen_id',
    as: 'screen'
});

// Add Screen-ShowTime association
ShowTime.belongsTo(Screen, {
    foreignKey: 'screen_id',
    as: 'screen'
});

Screen.hasMany(ShowTime, {
    foreignKey: 'screen_id',
    as: 'showTimes'
});

Event.hasMany(ShowTime, {
    foreignKey: 'event_id',
    as: 'showTimes'
});

ShowTime.belongsTo(Event, {
    foreignKey: 'event_id',
    as: 'event'
});

Event.hasMany(Booking, {
    foreignKey: 'event_id',
    as: 'bookings'
});

Booking.belongsTo(Event, {
    foreignKey: 'event_id',
    as: 'event'
});

User.hasMany(Booking, {
    foreignKey: 'user_id',
    as: 'bookings'
});

Booking.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user'
});

Booking.hasOne(Payment, {
    foreignKey: 'booking_id',
    as: 'payment'
});

Payment.belongsTo(Booking, {
    foreignKey: 'booking_id',
    as: 'booking'
});

// Single export at the end
module.exports = {
    User,
    Venue,
    Event,
    Category,
    Screen,
    Seat,
    Booking,
    Review,
    Payment,
    ShowTime
};