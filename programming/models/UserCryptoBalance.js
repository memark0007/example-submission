const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const User = require('./User');
const Cryptocurrency = require('./Cryptocurrency');

const UserCryptoBalance = sequelize.define('UserCryptoBalance', {
  balance: DataTypes.FLOAT
});

UserCryptoBalance.belongsTo(User);
UserCryptoBalance.belongsTo(Cryptocurrency);

module.exports = UserCryptoBalance;
