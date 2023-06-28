const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Cryptocurrency = sequelize.define('Cryptocurrency', {
  name: DataTypes.STRING,
  symbol: DataTypes.STRING
});

module.exports = Cryptocurrency;
