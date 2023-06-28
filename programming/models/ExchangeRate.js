const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const Cryptocurrency = require('./Cryptocurrency');

const ExchangeRate = sequelize.define('ExchangeRate', {
  fromCryptoId: {
    type: DataTypes.INTEGER,
    references: {
      model: Cryptocurrency,
      key: 'id',
    }
  },
  toCryptoId: {
    type: DataTypes.INTEGER,
    references: {
      model: Cryptocurrency,
      key: 'id',
    }
  },
  rate: DataTypes.FLOAT
});

module.exports = ExchangeRate;
