const path = require('path');
const db = require(path.join(__dirname, '..', 'lib')).db.sequilize;


let params = {
  timestamps: true
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
  creator: {
    type: db.Sequelize.UUID,
    allowNull: false
  },
  price: {
    type: db.Sequelize.INTEGER,
    allowNull: false,
    unique: false
  },
  discount: {
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
  cover: {
    type: db.Sequelize.STRING,
    allowNull: true,
    defaultValue: null
  },
  title: {
    type: db.Sequelize.STRING,
    allowNull: false,
    unique: false
  },
  description: {
    type: db.Sequelize.TEXT,
    allowNull: false,
    unique: false
  },
  rates: {
    type: db.Sequelize.INTEGER,
    allowNull: false,
    unique: false,
    defaultValue: 0
  }
}, params);


module.exports = Mod;
