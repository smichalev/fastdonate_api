const User = require('models/user.model');
const Server = require('models/server.model');
const Files = require('models/files.model');
const Mod = require('models/mod.model');

return Promise.all([
		User.sync({force: true}),
		Server.sync({force: true}),
		Files.sync({force: true}),
		Mod.sync({force: true})
	]).then(() => {
	console.log('TABLES SUCCESSFULLY RECREATED');
})

