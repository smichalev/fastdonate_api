const path = require('path');
const User = require(path.join(__dirname, 'user.model'));
const Mod = require(path.join(__dirname, 'mod.model'));
const Hash = require(path.join(__dirname, 'hash.model'));
const Hashmod = require(path.join(__dirname, 'hashmod.model'));
const Comment = require(path.join(__dirname, 'comments.model'));

Mod.belongsTo(User, {
  hooks: false,
  as: 'Creator',
  foreignKey: 'creator',
  targetKey: 'id'
});

User.hasMany(Mod, {
  hooks: false,
  as: {
    singular: 'Mod',
    plural: 'Mods'
  },
  foreignKey: 'creator',
  sourceKey: 'id'
});

Mod.belongsToMany(Hash, {
  hooks: false,
  as: {
    singular: 'Tag',
    plural: 'Tags'
  },
  through: {
    model: Hashmod,
    unique: true
  },
  foreignKey: 'mod_id',
  otherKey: 'tag_id',
  paranoid: true,
  onDelete: 'SET NULL'
});
Hash.belongsToMany(Mod, {
  hooks: false,
  as: {
    singular: 'Post',
    plural: 'Posts'
  },
  through: {
    model: Hashmod,
    unique: true
  },
  foreignKey: 'tag_id',
  otherKey: 'mod_id',
  paranoid: true,
  onDelete: 'SET NULL'
});

Comment.belongsTo(User, {
  hooks: false,
  as: 'Creator',
  foreignKey: 'creator',
  targetKey: 'id'
});

User.hasMany(Comment, {
  hooks: false,
  as: {
    singular: 'Comment',
    plural: 'Comments'
  },
  foreignKey: 'creator',
  sourceKey: 'id'
});






