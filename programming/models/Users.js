const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const User = sequelize.define('Users', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true
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


