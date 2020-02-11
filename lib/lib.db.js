const path = require('path');
const config = require(path.join(__dirname, '..', 'config'));
const Sequelize = require('sequelize');

const sequilize = new Sequelize({
	database: config.db.database,
	username: config.db.username,
	password: config.db.password,
	dialect: config.db.dialect
});

module.exports = {Sequelize, sequilize};
