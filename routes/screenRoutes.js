const express = require('express');
const router = express.Router();
const screenController = require('../controllers/screencontroller');
const { authorize } = require('../middleware/authmiddleware');

router.get('/venue/:venueId', screenController.getVenueScreens);
router.post('/', authorize('venue_admin'), screenController.createScreen);
router.put('/:id', authorize('venue_admin'), screenController.updateScreen);

module.exports = router;