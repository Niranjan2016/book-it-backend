const express = require('express');
const router = express.Router();
const venueController = require('../controllers/venueController');
const { authorize } = require('../middleware/authmiddleware');
const multer = require('multer');
const path = require('path');

// Add base URL configuration
const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';

// Configure multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/venues');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'venue-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Add logging middleware
router.use((req, res, next) => {
    console.log('Venue Route accessed:', {
        method: req.method,
        path: req.path,
        contentType: req.headers['content-type']
    });
    next();
});

// Define all venue routes
router.get('/admin', authorize('venue_admin'), venueController.getAdminVenues);

router.get('/with-events', venueController.getVenuesWithEvents);

router.get('/:venueId/events', authorize('superadmin', 'venue_admin'), venueController.getVenueEvents);

router.get('/:id', venueController.getVenue);
// Remove all @swagger comments from this file, leaving only the route definitions
router.get('/', venueController.getVenues);
router.get('/with-events', venueController.getVenuesWithEvents);
// Add this route with your other venue routes
router.get('/:id/screens', venueController.getVenueScreens);

// Consolidate create venue route
// Update create venue route to allow venue_admin
// Add this debug middleware before your routes
router.use((req, res, next) => {
    console.log('Auth Debug:', {
        headers: req.headers.authorization,
        user: req.user,
        method: req.method,
        path: req.path
    });
    next();
});

// Update create venue route with more specific roles
router.post('/',
    authorize(['venue_admin', 'admin', 'superadmin']), // Added all possible admin roles
    upload.single('image'),
    (req, res, next) => {
        console.log('Create Venue - User Role:', req.user?.role); // Add role debug log
        if (req.file) {
            req.body.image_url = `${BASE_URL}/uploads/venues/${req.file.filename}`;
        }
        next();
    },
    venueController.createVenue
);

// Consolidate update venue route
router.put('/:id',
    authorize('superadmin'),  // Added authorization
    upload.single('image'),
    (req, res, next) => {
        if (req.file) {
            req.body.image_url = `${BASE_URL}/uploads/venues/${req.file.filename}`;
        }
        next();
    },
    venueController.updateVenue
);

router.delete('/:id', authorize('superadmin'), venueController.deleteVenue);

module.exports = router;