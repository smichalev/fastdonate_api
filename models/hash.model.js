const path = require('path');
const db = require(path.join(__dirname, '..', 'lib')).db.sequilize;


let params = {
  timestamps: false
};

const Hash = db.define('hash', {
  id: {
    type: db.Sequelize.UUID,
    allowNull: false,
    primaryKey: true,
    unique: true
  },
  title: {
    type: db.Sequelize.STRING,
    allowNull: false,
    unique: true
  }
}, params);


module.exports = Hash;
