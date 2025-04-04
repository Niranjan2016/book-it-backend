const Order = require('../models/Order');
const Booking = require('../models/Booking');
const User = require('../models/User');
const Event = require('../models/Event');
const ShowTime = require('../models/ShowTime');

const getAdminOrders = async (req, res) => {
    try {
        if (!req.user || req.user.role !== 'venue_admin') {
            return res.status(403).json({ message: 'Access denied: Not a venue admin' });
        }

        const orders = await Order.findAll({
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['user_id', 'full_name', 'email', 'phone']
                },
                {
                    model: Event,
                    as: 'event',
                    where: { venue_id: req.user.managed_venue_id },
                    attributes: ['event_id', 'event_name', 'event_date', 'ticket_price']
                },
                {
                    model: ShowTime,
                    as: 'showTime',
                    attributes: ['showtime_id', 'show_date', 'start_time']
                }
            ],
            attributes: [
                'order_id',
                'total_amount',
                'status',
                'payment_status',
                'created_at',
                'seat_numbers'
            ],
            order: [['created_at', 'DESC']]
        });

        res.status(200).json(orders);
    } catch (error) {
        console.error('Error fetching admin orders:', error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAdminOrders
};