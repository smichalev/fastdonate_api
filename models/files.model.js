const path = require('path');
const db = require(path.join(__dirname, '..', 'lib')).db.sequilize;

let params = {
	timestamps: true
};

const File = db.define('file', {
	id: {
		type: db.Sequelize.UUID,
		allowNull: false,
		primaryKey: true,
		unique: true
	},
	parent: {
		type: db.Sequelize.UUID,
		allowNull: false,
		unique: false,
	},
	creater: {
		type: db.Sequelize.UUID,
		allowNull: false,
		unique: false,
	},
	type: {
		type: db.Sequelize.STRING,
		allowNull: false,
		unique: false
	},
	path: {
		type: db.Sequelize.STRING,
		allowNull: false,
		unique: false
	}
}, params);

module.exports = File;