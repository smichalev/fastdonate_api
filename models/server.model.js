const path = require('path');
const db = require(path.join(__dirname, '..', 'lib')).db.sequilize;

let params = {
	timestamps: true
};

const Server = db.define('server', {
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
	creater: {
		type: db.Sequelize.STRING,
		allowNull: false,
		unique: false
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
		allowNull: false,
		unique: false
	}
}, params);

module.exports = Server;