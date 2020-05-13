const path = require('path');
const db = require(path.join(__dirname, '..', 'lib')).db.sequilize;

let params = {
	timestamps: true,
};

const Gameserver = db.define('gameserver', {
	id: {
		type: db.Sequelize.UUID,
		allowNull: false,
		primaryKey: true,
		unique: true,
	},
	user: {
		type: db.Sequelize.UUID,
		allowNull: false,
		unique: false,
	},
	name: {
		type: db.Sequelize.STRING,
		allowNull: false,
		unique: false,
	},
	gamename: {
		type: db.Sequelize.STRING,
		allowNull: false,
		unique: false,
	},
	map: {
		type: db.Sequelize.STRING,
		allowNull: false,
		unique: false,
	},
	ip: {
		type: db.Sequelize.STRING,
		allowNull: false,
		unique: false,
	},
	port: {
		type: db.Sequelize.INTEGER,
		allowNull: false,
		unique: false,
	},
	player: {
		type: db.Sequelize.INTEGER,
		allowNull: false,
		unique: false,
	},
	maxplayers: {
		type: db.Sequelize.INTEGER,
		allowNull: false,
		unique: false,
	},
	running: {
		type: db.Sequelize.BOOLEAN,
		allowNull: false,
		unique: false,
		defaultValue: true,
	},
	data: {
		type: db.Sequelize.JSONB,
		allowNull: false,
		unique: false,
		defaultValue: {},
	},
}, params);

module.exports = Gameserver;