const { DataTypes } = require('sequelize');
const db = require('../config/database');

const Contact = db.define('Contact', {
    contact_id: {  // Changed from 'id' to 'contact_id'
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    subject: {
        type: DataTypes.STRING,
        allowNull: false
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    tableName: 'contacts',
    timestamps: false
});

module.exports = Contact;