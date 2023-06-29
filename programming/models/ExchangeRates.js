const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const Cryptocurrencies = require('./Cryptocurrencies');

const ExchangeRates = sequelize.define('ExchangeRates', {

  fromCryptoId: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
    references: {
      model: Cryptocurrencies,
      key: 'symbol',
    }
  },
  toCryptoId: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
    references: {
      model: Cryptocurrencies,
      key: 'symbol',
    }
  },
  rate: {
    type: DataTypes.DOUBLE,
    allowNull: false
  }
});

module.exports = ExchangeRates;
