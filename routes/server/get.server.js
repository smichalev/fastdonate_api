const Server = require('models/server.model');
const lgsl = require('lib/lib.lgsl');

module.exports = (router) => {
	router.get('/list', request);
};

let request = (req, res, next) => {
	let limit = 2;
	let query = {};
	if (req.query.page) {
		if (!/^\d+$/.test(req.query.page)) {
			return next({msg: 'ID может быть только числом!', code: 400});
		}
		req.query.page = +req.query.page;
		query.limit = limit;
		if (req.query.page === 0 || req.query.page === 1) {
			query.offset = 0;
		}
		else {
			query.offset = (req.query.page - 1) * query.limit;
		}
	}
	else {
		query.limit = limit;
		query.offset = 0;
	}


	return Promise.all([
			Server.findAll(query),
			Server.count({})
		])
		.then(([servers, count]) => {
			let pages = Math.round(count / limit);
			let list = [];
			for (let i = 0; i < servers.length; i++) {
				list.push({
					id: servers[i].id,
					host: servers[i].host,
					port: servers[i].port,
					game: servers[i].game,
					mod: servers[i].mod
				});
			}
			return lgsl(list)
				.then((data) => {
					for (let i = 0; i < data.length; i++) {
						list[i].info = {};
						if (data[i].status === 'fulfilled') {
							list[i].info = data[i].value;
						}
					}
				})
				.then(() => res.send({status: 'success', servers: list, pages}));
		});
};