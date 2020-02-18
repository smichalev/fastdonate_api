const Server = require('models/server.model');
const lgsl = require('lib/lib.lgsl');
const mw = require('mw');

module.exports = (router) => {
	router.get('/list', request);
};

let request = (req, res, next) => {
	return Server.findAll({})
		.then((servers) => {
			let list = [];
			for (let i = 0; i < servers.length; i++) {
				list.push({host: servers[i].host, port: servers[i].port, game: servers[i].game, mod: servers[i].mod});
			}
			return lgsl(list)
				.then((data) => {
					for (let i = 0; i < data.length; i++) {
						if (data[i].status === 'fulfilled') {
							list[i].info = data[i].value;
						}
						else {
							list[i].info = {};
						}
					}
				})
				.then(() => {
					return res.send({status: 'success', servers: list});
				});

		});
};
