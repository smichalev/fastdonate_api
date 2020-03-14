const path = require('path');
const db = require(path.join(__dirname, '..', 'lib')).db.sequilize;

let params = {
	timestamps: true
};

const Server = db.define('server', {
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
	creator: {
		type: db.Sequelize.UUID,
		allowNull: false,
		unique: false,
	},
	host: {
		type: db.Sequelize.STRING,
		allowNull: false,
		unique: false
	},
	port: {
		type: db.Sequelize.INTEGER,
		allowNull: false,
		unique: false
	},
	game: {
		type: db.Sequelize.STRING,
		allowNull: false,
		unique: false
	},
	mod: {
		type: db.Sequelize.STRING,
		allowNull: true,
		unique: false,
		defaultValue: null
	},
	value: {
		type: db.Sequelize.JSONB,
		allowNull: false,
		unique: false,
		defaultValue: {}
	}
}, params);

module.exports = Server;