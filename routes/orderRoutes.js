const express = require('express');
const router = express.Router();
const { getAdminOrders } = require('../controllers/orderController');
const { authenticateToken } = require('../middleware/auth');

router.get('/admin', authenticateToken, getAdminOrders);

module.exports = router;