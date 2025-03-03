const express = require('express');
const router = express.Router();

const { authorize } = require('../middleware/authmiddleware');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const {
    getEvents,
    getEvent,
    createEvent,
    updateEvent,
    deleteEvent,
    updateAvailableSeats,
    searchEvents,
    getFilteredEvents,
    getEventsByCategory,
    getAdminEvents,
    getShowTimeSeats
} = require('../controllers/eventcontroller');

// Add base URL configuration
const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, '..', 'uploads', 'events');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}
// Configure multer for event images
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);  // Use the created directory path
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'event-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Update routes to handle image uploads with complete URLs
router.post('/', upload.single('image'), (req, res, next) => {
    if (req.file) {
        req.body.image_url = `${BASE_URL}/uploads/events/${req.file.filename}`;
    }
    next();
}, createEvent);

router.put('/:id', upload.single('image'), (req, res, next) => {
    if (req.file) {
        req.body.image_url = `${BASE_URL}/uploads/events/${req.file.filename}`;
    }
    next();
}, updateEvent);

// GET routes - order matters for route matching
router.get('/admin', authorize('venue_admin'), getAdminEvents);
router.get('/search', searchEvents);
router.get('/filtered', getFilteredEvents);
router.get('/by-category/:categoryId', getEventsByCategory);
router.get('/:eventId/show-times/:showTimeId', getShowTimeSeats);
router.get('/:id', getEvent);

// Base routes
router.get('/', getEvents);  // This handles GET /api/events

// Other routes
router.put('/:id/seats', updateAvailableSeats);
router.delete('/:id', deleteEvent);

module.exports = router;