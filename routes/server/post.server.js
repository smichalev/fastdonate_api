const Server = require('models/server.model');
const mw = require('mw');

module.exports = (router) => {
	router.post('/new', mw.checkLogin, request);
};

let request = (req, res, next) => {
	if (!req.body.port || !req.body.host) {
		return next({msg: 'Обязательный параметры не были переданы', code: 400});
	}
	return Server.findOne({
			where: {
				host: req.body.host,
				port: req.body.port
			}
		})
		.then((server) => {
			if (server) {
				return next({msg: 'Такой сервер уже есть!', code: 400});
			}
			return Server.create({
					creater: +req.body.creater,
					host: req.body.host,
					port: req.body.port,
					game: req.body.game,
					mod: req.body.mod
				})
				.then((data) => {
					return res.status(200).send({status: 'success', server: data});
				});
		});
};