const express = require('express');
const router = express.Router();
const {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    register,
    login,
    getProfile,
    updateProfile,
    getVenueUsers,  // Add this import
    createVenueAdmin
} = require('../controllers/usercontroller'); // Make sure the filename case matches exactly
const { authorize } = require('../middleware/authmiddleware');

router.get('/', authorize(['superadmin', 'venue_admin']), getUsers);  // Main route for getting users with query params

// Public routes
// router.post('/register', register);  // Verify register is defined
// router.post('/login', login);        // Verify login is defined

// Protected routes
// router.get('/profile', authorize('user', 'venue_admin', 'superadmin'), getProfile);
// router.put('/profile', authorize('user', 'venue_admin', 'superadmin'), updateProfile);

// Venue admin routes - Move these before the parameterized routes
router.get('/venue-users', authorize('venue_admin'), getVenueUsers);
router.post('/create-venue-admin', authorize('venue_admin'), createVenueAdmin);

// Main users route - should be last to handle query parameters correctly
// router.get('/', authorize(['superadmin', 'venue_admin']), getUsers);
router.get('/:role', authorize(['superadmin', 'venue_admin']), getUsers);  // Main route for getting users with query params

// User specific routes
router.get('/user/:id', authorize(['superadmin', 'venue_admin']), getUser);
router.post('/create', authorize(['superadmin', 'venue_admin']), createUser);
router.put('/user/:id', authorize('superadmin'), updateUser);
router.delete('/user/:id', authorize('superadmin'), deleteUser);

// General routes with parameters - Move these to the end
router.get('/', authorize(['superadmin', 'venue_admin']), getUsers);
router.get('/:role', authorize(['superadmin', 'venue_admin']), getUsers);

// Admin routes

// Remove the /:role route as we're handling role filtering via query parameter
module.exports = router;