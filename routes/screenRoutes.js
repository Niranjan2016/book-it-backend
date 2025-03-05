const express = require('express');
const router = express.Router();
const screenController = require('../controllers/screencontroller');
const { authenticateToken, isVenueAdmin } = require('../middleware/auth');

router.post('/:screenId/categories', authenticateToken, isVenueAdmin, screenController.addSeatCategories);
router.put('/:screenId/categories', authenticateToken, isVenueAdmin, screenController.updateSeatCategories);

module.exports = router;