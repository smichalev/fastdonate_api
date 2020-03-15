const path = require('path');
const db = require(path.join(__dirname, '..', 'lib')).db.sequilize;


let params = {
	timestamps: true
};

const Purchase = db.define('purchase', {
	id: {
		type: db.Sequelize.UUID,
		allowNull: false,
		primaryKey: true,
		unique: true
	},
	sellerid: {
		type: db.Sequelize.UUID,
		allowNull: false,
		unique: false
	},
	customerid: {
		type: db.Sequelize.UUID,
		allowNull: false,
		unique: false
	},
	itemid: {
		type: db.Sequelize.UUID,
		allowNull: false,
		unique: false
	},
	summ: {
		type: db.Sequelize.REAL,
		allowNull: false,
		unique: false,
		defaultValue: 0
	}
}, params);



module.exports = Purchase;
