const express = require('express');
const router = express.Router();
const { login } = require('../controllers/authcontroller');

// Base auth routes
router.post('/login', login);

// NextAuth callback route
router.post('/callback/credentials', login);

module.exports = router;