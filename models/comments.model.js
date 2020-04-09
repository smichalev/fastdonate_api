const path = require('path');
const db = require(path.join(__dirname, '..', 'lib')).db.sequilize;

let params = {
  timestamps: true
};

const Comment = db.define('comment', {
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
  essence: {
    type: db.Sequelize.UUID,
    allowNull: false,
    unique: false
  },
  parent: {
    type: db.Sequelize.UUID,
    allowNull: true,
    unique: false,
    defaultValue: null
  },
  creator: {
    type: db.Sequelize.UUID,
    allowNull: false,
    unique: false
  },
  text: {
    type: db.Sequelize.TEXT,
    allowNull: false,
    unique: false
  },
  rate: {
    type: db.Sequelize.INTEGER,
    allowNull: false,
    unique: false,
    defaultValue: 0
  }
}, params);

module.exports = Comment;
