const express = require('express');

// Import models
const Users = require('../models/Users');
const Cryptocurrencies = require('../models/Cryptocurrencies');
const UserCryptoBalances = require('../models/UserCryptoBalances');
const Transactions = require('../models/Transactions');
const ExchangeRates = require('../models/ExchangeRates');

const bcrypt = require('bcrypt');

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database'); 


const router = express.Router();

// Middleware to check if user is an admin
const checkAdmin = async (req, res, next) => {
  const { username } = req.body;
  const user = await Users.findByPk(username); // Assumes you have some way of getting the logged-in user's ID
  // console.log(userId, user)

  if (user && user.isAdmin) {
    next();
  } else {
    res.status(403).json({ error: 'User is not an admin' });
  }
};


// Transfer cryptocurrency to another user
router.post('/users/:username/transfer', async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { toUsername, fromCryptoId, toCryptoId, amount } = req.body;
    const fromUser = await Users.findOne({ where: { username: req.params.username } }, { transaction: t });
    const toUser = await Users.findOne({ where: { username: toUsername } }, { transaction: t });

    if (fromUser && toUser) {
      const fromUserBalance = await UserCryptoBalances.findOne({ where: { userId: fromUser.username, cryptoId: fromCryptoId } }, { transaction: t });
      if (fromUserBalance && fromUserBalance.balance >= amount) {
        const exchangeRate = await ExchangeRates.findOne({ where: { fromCryptoId, toCryptoId } }, { transaction: t });
        if (exchangeRate) {
          const receivedAmount = amount * exchangeRate.rate;

          await Transactions.create({
            fromUserId: fromUser.username,
            toUserId: toUser.username,
            fromCryptoId,
            toCryptoId,
            sentAmount: amount,
            rate: exchangeRate.rate,
            receivedAmount
          }, { transaction: t });

          fromUserBalance.balance -= amount;
          await fromUserBalance.save({ transaction: t });

          const toUserBalance = await UserCryptoBalances.findOne({ where: { userId: toUser.username, cryptoId: toCryptoId } }, { transaction: t });
          if (toUserBalance) {
            toUserBalance.balance += receivedAmount;
            await toUserBalance.save({ transaction: t });
          } else {
            await UserCryptoBalances.create({ userId: toUser.username, cryptoId: toCryptoId, balance: receivedAmount }, { transaction: t });
          }

          await t.commit();
          res.json({ success: true, message: 'Transfer successful' });
        } else {
          await t.rollback();
          res.status(400).json({ error: 'Exchange rate not found' });
        }
      } else {
        await t.rollback();
        res.status(400).json({ error: 'Insufficient balance' });
      }
    } else {
      await t.rollback();
      res.status(400).json({ error: 'User not found' });
    }
  } catch (error) {
    await t.rollback();
    res.status(500).json({ error: error.toString() });
  }
});

module.exports = router;

// Fetch total balances for all cryptocurrencies
router.get('/admin/balances', checkAdmin, async (req, res) => {
  try {
    const result = await sequelize.query(`
      SELECT  c.symbol, SUM(uc.balance) AS total
      FROM UserCryptoBalances AS uc
      JOIN Cryptocurrencies AS c ON uc.cryptoId = c.symbol
      GROUP BY c.symbol
    `, { type: Sequelize.QueryTypes.SELECT });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});


// Increase or decrease a user's balance
router.put('/admin/users/balance', checkAdmin, async (req, res) => {
  try {
    const { username, userId , toCryptoId, addBalance } = req.body;
    
    // console.log(username, userId , toCryptoId, addBalance)
    let userCryptoBalance = await UserCryptoBalances.findOne({ where: { userId: userId, cryptoId: toCryptoId } });
    console.log(userCryptoBalance)

    if (!userCryptoBalance) {
      // If the user doesn't have a balance for the cryptocurrency, create a new document
      userCryptoBalance = new UserCryptoBalances({ userId: userId, cryptoId: toCryptoId, balance: addBalance });
    } else {
      // If the user does have a balance for the cryptocurrency, adjust the existing balance
      userCryptoBalance.balance += addBalance;
    }

    // Save the updated (or new) balance
    await userCryptoBalance.save();

    res.json({ success: true, addBalance: userCryptoBalance.balance });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

// Add a new cryptocurrency
router.post('/admin/currencies/add', checkAdmin, async (req, res) => {
  try {
    const { symbol } = req.body;
    const currency = await Cryptocurrencies.create({ symbol });
    res.json(currency);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

// Update an existing cryptocurrency's exchange rate
router.put('/admin/exchangeRate/upsert', checkAdmin, async (req, res) => {
  try {
    const { fromCryptoId, toCryptoId, rate } = req.body;
    const exchangeRate = await ExchangeRates.upsert({
      fromCryptoId,
      toCryptoId,
      rate
    });
    console.log(exchangeRate)
    res.json(exchangeRate);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

// POST /users: Create a new user
router.post('/user/create', async (req, res) => {
  try {
    const { username, isAdmin, password  } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10); 
    const user = await Users.create({ 
      username,  
      password: hashedPassword,
      isAdmin
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

module.exports = router;
