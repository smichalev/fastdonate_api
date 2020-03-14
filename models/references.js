const User = require('./user.model');
const Mod = require('./mod.model');

Mod.belongsTo(User, {
	hooks: false,
	as: 'Creater',
	foreignKey: 'creater',
	targetKey: 'id'
});

User.hasMany(Mod, {
	hooks: false,
	as: {
		singular: 'Mod',
		plural: 'Mods'
	},
	foreignKey: 'creater',
	sourceKey: 'id'
});