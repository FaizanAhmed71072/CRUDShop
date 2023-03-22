const Sequelize = require('sequelize');

const sequelize = new Sequelize('db1', 'admin', 'password', {dialect: 'mysql', host: 'localhost'});

module.exports = sequelize;