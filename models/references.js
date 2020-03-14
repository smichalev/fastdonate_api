const User = require('./user.model');
const Mod = require('./mod.model');

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