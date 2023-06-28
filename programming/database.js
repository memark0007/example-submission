const { Sequelize } = require('sequelize');


const sequelize = new Sequelize(process.env.DATABASENAME, process.env.USERNAME_DB, process.env.PASSWORD_DB, {
  host: 'localhost',
  dialect: 'mariadb',
  logging: false,
});

module.exports = sequelize;