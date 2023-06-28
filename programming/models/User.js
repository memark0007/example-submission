// Import the necessary modules
const { DataTypes } = require('sequelize');
const sequelize = require('../database');

// Define the User model
const User = sequelize.define('User', {

  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },

  email: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  },

  password: {
    type: DataTypes.STRING,
    allowNull: false
  },

  isAdmin: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
});


module.exports = User;
