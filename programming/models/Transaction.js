const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const User = require('./User');
const Cryptocurrency = require('./Cryptocurrency');

const Transaction = sequelize.define('Transaction', {
  fromUserId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id',
    }
  },
  toUserId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id',
    }
  },
  cryptoId: {
    type: DataTypes.INTEGER,
    references: {
      model: Cryptocurrency,
      key: 'id',
    }
  },
  amount: DataTypes.FLOAT
});

module.exports = Transaction;
