const express = require('express');

// Import models
const User = require('../models/Users');
const Cryptocurrency = require('../models/Cryptocurrencies');
const UserCryptoBalance = require('../models/UserCryptoBalances');
const Transaction = require('../models/Transactions');
const ExchangeRate = require('../models/ExchangeRates');

const bcrypt = require('bcrypt');

const { Sequelize } = require('sequelize');

const router = express.Router();

// Middleware to check if user is an admin
const checkAdmin = async (req, res, next) => {
  const { username } = req.body;
  const user = await User.findByPk(username); // Assumes you have some way of getting the logged-in user's ID
  // console.log(userId, user)

  if (user && user.isAdmin) {
    next();
  } else {
    res.status(403).json({ error: 'User is not an admin' });
  }
};

// Fetch a user's balance
router.get('/users/:id/balance', async (req, res) => {
  try {
    const userCryptoBalance = await UserCryptoBalance.findAll({ where: { userId: req.params.id }});
    res.json(userCryptoBalance);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

// Transfer cryptocurrencies from one user to another
router.post('/users/:id/transfer', async (req, res) => {
  try {
    const { toUserId, exchangeId, amount } = req.body;
    const transaction = await Transaction.create({
      fromUserId: req.params.id,
      toUserId,
      exchangeId,
      amount
    });
    // Also update the balance of both users in the UserCryptoBalance table here
    res.json(transaction);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

// Fetch total balances for all cryptocurrencies
router.get('/admin/balances', checkAdmin, async (req, res) => {
  try {
    const balances = await UserCryptoBalance.findAll({
      attributes: ['cryptoId', [Sequelize.fn('sum', Sequelize.col('balance')), 'total']]
    });
    res.json(balances);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});



// Increase or decrease a user's balance
router.put('/admin/users/balance', checkAdmin, async (req, res) => {
  try {
    const { username, userId , toCryptoId, balance } = req.body;
    
    console.log(username, userId , toCryptoId, balance)
    let userCryptoBalance = await UserCryptoBalance.findOne({ where: { userId: userId, cryptoId: toCryptoId } });
    console.log(userCryptoBalance)

    if (!userCryptoBalance) {
      // If the user doesn't have a balance for the cryptocurrency, create a new document
      userCryptoBalance = new UserCryptoBalance({ userId: userId, cryptoId: toCryptoId, balance: balance });
    } else {
      // If the user does have a balance for the cryptocurrency, adjust the existing balance
      userCryptoBalance.balance += balance;
    }

    // Save the updated (or new) balance
    await userCryptoBalance.save();

    res.json({ success: true, balance: userCryptoBalance.balance });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

// Add a new cryptocurrency
router.post('/admin/currencies/add', checkAdmin, async (req, res) => {
  try {
    const { symbol } = req.body;
    const currency = await Cryptocurrency.create({ symbol });
    res.json(currency);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

// Update an existing cryptocurrency's exchange rate
router.put('/admin/exchangeRate/upsert', checkAdmin, async (req, res) => {
  try {
    const { fromCryptoId, toCryptoId, rate } = req.body;
    const exchangeRate = await ExchangeRate.upsert({
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
    const user = await User.create({ 
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
