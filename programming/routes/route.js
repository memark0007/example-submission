const express = require('express');

// Import models
const User = require('../models/User');
const Cryptocurrency = require('../models/Cryptocurrency');
const UserCryptoBalance = require('../models/UserCryptoBalance');
const Transaction = require('../models/Transaction');
const ExchangeRate = require('../models/ExchangeRate');

const bcrypt = require('bcrypt');


const router = express.Router();

// Middleware to check if user is an admin
const checkAdmin = async (req, res, next) => {
  const { userId } = req.body;
  const user = await User.findByPk(userId); // Assumes you have some way of getting the logged-in user's ID
  console.log(userId, user)
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
    const { toUserId, cryptoId, amount } = req.body;
    const transaction = await Transaction.create({
      fromUserId: req.params.id,
      toUserId,
      cryptoId,
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
    const balances = await UserCryptoBalance.sum('balance', { group: ['cryptoId'] });
    res.json(balances);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

// Increase or decrease a user's balance
router.post('/admin/users/:id/balance', checkAdmin, async (req, res) => {
  try {
    const { cryptoId, amount } = req.body;
    // Find the UserCryptoBalance for the user and cryptocurrency, and increase/decrease the balance here
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

// Add a new cryptocurrency
router.post('/admin/currencies', checkAdmin, async (req, res) => {
  try {
    const { name, symbol } = req.body;
    const currency = await Cryptocurrency.create({ name, symbol });
    res.json(currency);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

// Update an existing cryptocurrency's exchange rate
router.put('/admin/currencies/:id', checkAdmin, async (req, res) => {
  try {
    const { rate } = req.body;
    const exchangeRate = await ExchangeRate.upsert({
      rate
    });
    res.json(exchangeRate);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

// POST /users: Create a new user
router.post('/users', async (req, res) => {
  try {
    const { username, email,isAdmin, password  } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10); 
    const user = await User.create({ 
      username, 
      email, 
      password: hashedPassword,
      isAdmin
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

module.exports = router;
