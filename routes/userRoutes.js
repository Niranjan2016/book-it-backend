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
    updateProfile
} = require('../controllers/usercontroller');
const { authorize } = require('../middleware/authmiddleware');

// Public routes
router.post('/register', register);

router.post('/login', login);

// Protected routes
router.get('/profile', authorize('user', 'venue_admin', 'superadmin'), getProfile);

router.put('/profile', authorize('user', 'venue_admin', 'superadmin'), updateProfile);

router.put('/profile', authorize('user', 'venue_admin', 'superadmin'), updateProfile);

// Admin routes
router.get('/', authorize('superadmin'), getUsers);
router.get('/:id', authorize('superadmin'), getUser);
router.post('/', authorize('superadmin'), createUser);
router.put('/:id', authorize('superadmin'), updateUser);
router.delete('/:id', authorize('superadmin'), deleteUser);

module.exports = router;