const User = require('./user.model');
const Mod = require('./mod.model');
const Server = require('./server.model');

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

Server.belongsTo(User, {
	hooks: false,
	as: 'Creator',
	foreignKey: 'creator',
	targetKey: 'id'
});

User.hasMany(Server, {
	hooks: false,
	as: {
		singular: 'Server',
		plural: 'Servers'
	},
	foreignKey: 'creator',
	sourceKey: 'id'
});