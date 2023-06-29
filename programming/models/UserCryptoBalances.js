const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const Users = require('./Users');
const Cryptocurrencies = require('./Cryptocurrencies');

const UserCryptoBalances = sequelize.define('UserCryptoBalances', {
 
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
    references: {
      model: Users,
      key: 'username',
    }
  },
  cryptoId: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
    references: {
      model: Cryptocurrencies,
      key: 'symbol',
    }
  },
  balance: {
    type: DataTypes.DOUBLE,
    allowNull: false
  }
});

module.exports = UserCryptoBalances;
