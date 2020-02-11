const path = require('path');
const db = require(path.join(__dirname, '..', 'lib')).db.sequilize;

let params = {
	timestamps: true
};

const User = db.define('user', {
	id: {
		type: db.Sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true,
		allowNull: false
	},
	active: {
		type: db.Sequelize.BOOLEAN,
		allowNull: false,
		unique: false,
		defaultValue: true
	},
	steamid: {
		type: db.Sequelize.STRING,
		allowNull: false,
		foreignKey: true,
		unique: true
	},
	login: {
		type: db.Sequelize.STRING,
		allowNull: true
	},
	profile: {
		type: db.Sequelize.STRING,
		allowNull: true,
		unique: true
	},
	avatar: {
		type: db.Sequelize.JSONB,
		allowNull: true,
		defaultValue: {}
	},
	country: {
		type: db.Sequelize.STRING,
		allowNull: true,
		unique: false,
		defaultValue: 'RU'
	},
	balance: {
		type: db.Sequelize.INTEGER,
		allowNull: true,
		unique: false,
		defaultValue: 0
	},
	role: {
		type: db.Sequelize.STRING,
		allowNull: true,
		unique: false,
		defaultValue: 'USER'
	}
}, params);

module.exports = User;