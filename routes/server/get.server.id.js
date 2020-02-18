const Server = require('models/server.model');
const lgsl = require('lib/lib.lgsl');

module.exports = (router) => {
	router.get('/list/:id', request);
};

let request = (req, res, next) => {
	if (!/^\d+$/.test(req.params.id)) {
		return next({msg: 'ID может быть только числом!', code: 400});
	}

	return Server.findOne({
			where: {
				id: req.params.id
			}
		})
		.then((server) => {
			if (!server) {
				return next({msg: 'Сервер не найден', code: 404});
			}

			let data = {};

			for (let i = 0; i < Object.keys(server.dataValues).length; i++) {
				data[Object.keys(server.dataValues)[i]] = server[Object.keys(server.dataValues)[i]];
			}

			lgsl([{host: data.host, port: data.port, game: data.game, mod: data.mod}])
				.then((info) => {
					data.info = {};
					if (info) {
						data.info = info;
					}
					return data;
				})
				.then((info) => res.send({status: 'success', server: info}));
		});
};