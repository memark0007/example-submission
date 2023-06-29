const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const Users = require('./Users');
const Cryptocurrencies = require('./Cryptocurrencies');

const Transactions = sequelize.define('Transactions', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  fromUserId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: Users,
      key: 'username',
    }
  },
  toUserId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: Users,
      key: 'username',
    }
  },
  fromCryptoId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  toCryptoId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  sentAmount: {
    type: DataTypes.DOUBLE,
    allowNull: false
  },
  rate: {
    type: DataTypes.DOUBLE,
    allowNull: false
  },
  receivedAmount: {
    type: DataTypes.DOUBLE,
    allowNull: false
  },
  
});

module.exports = Transactions;

