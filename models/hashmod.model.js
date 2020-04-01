const path = require('path');
const db = require(path.join(__dirname, '..', 'lib')).db.sequilize;


let params = {
  timestamps: false,
  paranoid: false,
  underscored: true,
  indexes: [
    {
      fields: ['mod_id']
    },
    {
      fields: ['tag_id']
    }
  ]
};

const Hashmod = db.define('hashmod', {
  mod_id: {
    type: db.Sequelize.UUID,
    primaryKey: true,
    allowNull: false
  },
  tag_id: {
    type: db.Sequelize.UUID,
    primaryKey: true,
    allowNull: false
  }
}, params);


module.exports = Hashmod;
