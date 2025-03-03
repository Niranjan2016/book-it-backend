const express = require('express');
const { submitContactForm } = require('../controllers/contactcontroller');
const router = express.Router();

router.post('/', submitContactForm);

module.exports = router;