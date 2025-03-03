const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Category = sequelize.define('Category', {
  category_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  image_url: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'categories',
  timestamps: false  // Set this to false since we don't have these columns
});

// Add association
Category.associate = (models) => {
    Category.hasMany(models.Event, {
        foreignKey: 'category_id',
        as: 'events'
    });
};

module.exports = Category;