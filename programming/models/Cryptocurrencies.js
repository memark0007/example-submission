const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Cryptocurrencies = sequelize.define('Cryptocurrencies', {
  symbol: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true
  }
});

module.exports = Cryptocurrencies;
