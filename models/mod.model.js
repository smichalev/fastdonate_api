const path = require('path');
const db = require(path.join(__dirname, '..', 'lib')).db.sequilize;

let params = {
	timestamps: false
};

const Mod = db.define('mod', {
	id: {
		type: db.Sequelize.UUID,
		allowNull: false,
		primaryKey: true,
		unique: true
	},
	active: {
		type: db.Sequelize.BOOLEAN,
		allowNull: false,
		unique: false,
		defaultValue: true
	},
	creater: {
		type: db.Sequelize.UUID,
		primaryKey: false,
		allowNull: false,
		unique: false
	},
	price: {
		type: db.Sequelize.INTEGER,
		allowNull: false,
		unique: false
	},
	sale: {
		type: db.Sequelize.INTEGER,
		allowNull: false,
		unique: false,
		defaultValue: 0
	},
	version: {
		type: db.Sequelize.STRING,
		allowNull: false,
		unique: false
	},
	title: {
		type: db.Sequelize.STRING,
		allowNull: false,
		unique: false
	},
	description: {
		type: db.Sequelize.STRING,
		allowNull: false,
		unique: false
	}
}, params);

module.exports = Mod;