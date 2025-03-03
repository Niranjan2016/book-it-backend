const Contact = require('../models/Contact');

const submitContactForm = async (req, res) => {
    try {
        const { name, email, phoneNumber, message } = req.body;
        const newContact = await Contact.create({
            name,
            email,
            phoneNumber,
            message,
        });

        res.status(201).json({
            success: true,
            message: 'Contact form submitted successfully',
            data: newContact,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error submitting contact form',
            error: error.message,
        });
    }
};

module.exports = {
    submitContactForm
};