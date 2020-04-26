const path = require('path');
const db = require(path.join(__dirname, '..', 'lib')).db.sequilize;


let params = {
	timestamps: true,
};

const User = db.define('user', {
	id: {
		type: db.Sequelize.UUID,
		allowNull: false,
		primaryKey: true,
		unique: true,
	},
	active: {
		type: db.Sequelize.BOOLEAN,
		allowNull: false,
		unique: false,
		defaultValue: true,
	},
	steamid: {
		type: db.Sequelize.BIGINT,
		allowNull: false,
		unique: true,
	},
	login: {
		type: db.Sequelize.STRING,
		allowNull: true,
		unique: false,
	},
	profile: {
		type: db.Sequelize.BIGINT,
		allowNull: false,
		unique: true,
	},
	avatar: {
		type: db.Sequelize.JSONB,
		allowNull: false,
		unique: false,
		defaultValue: {},
	},
	country: {
		type: db.Sequelize.STRING,
		allowNull: false,
		unique: false,
		defaultValue: 'RU',
	},
	balance: {
		type: db.Sequelize.REAL,
		allowNull: false,
		unique: false,
		defaultValue: 0,
	},
	role: {
		type: db.Sequelize.STRING,
		allowNull: false,
		unique: false,
		defaultValue: 'USER',
	},
	notify_post_mod: {
		type: db.Sequelize.BOOLEAN,
		allowNull: false,
		unique: false,
		defaultValue: true,
	},
	notify_authorization: {
		type: db.Sequelize.BOOLEAN,
		allowNull: false,
		unique: false,
		defaultValue: true,
	},
	notify_logout: {
		type: db.Sequelize.BOOLEAN,
		allowNull: false,
		unique: false,
		defaultValue: true,
	},
}, params);


module.exports = User;
