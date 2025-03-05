const express = require('express');
const router = express.Router();
const seatCategoryController = require('../controllers/seatCategoryController');
const { authenticateToken, isVenueAdmin } = require('../middleware/auth');

router.post('/screen/:screenId/categories', authenticateToken, isVenueAdmin, seatCategoryController.createSeatCategories);
router.get('/screen/:screenId/categories', seatCategoryController.getSeatCategories);

module.exports = router;