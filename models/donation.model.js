const path = require('path');
const db = require(path.join(__dirname, '..', 'lib')).db.sequilize;


let params = {
	timestamps: true
};

const Donation = db.define('donation', {
	id: {
		type: db.Sequelize.UUID,
		allowNull: false,
		primaryKey: true,
		unique: true
	},
	userid: {
		type: db.Sequelize.UUID,
		allowNull: false,
		unique: false
	},
	gate: {
		type: db.Sequelize.STRING,
		allowNull: false,
		unique: false
	},
	status: {
		type: db.Sequelize.STRING,
		allowNull: false,
		unique: false,
		defaultValue: ''
	},
	summ: {
		type: db.Sequelize.REAL,
		allowNull: false,
		unique: false,
		defaultValue: 0
	}
}, params);



module.exports = Donation;
