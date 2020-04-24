const path = require('path');
const db = require(path.join(__dirname, '..', 'lib')).db.sequilize;

let params = {
	timestamps: true,
};

const Event = db.define('event', {
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
	type: {
		type: db.Sequelize.STRING,
		allowNull: false,
		unique: false,
	},
	data: {
		type: db.Sequelize.JSONB,
		allowNull: false,
		unique: false,
		defaultValue: {},
	},
	readed: {
		type: db.Sequelize.BOOLEAN,
		allowNull: false,
		unique: false,
		defaultValue: false,
	},
}, params);

module.exports = Event;