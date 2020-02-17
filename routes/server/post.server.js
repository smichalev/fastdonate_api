const Server = require('models/server.model');
const lgsl = require('lib/lib.lgsl');
const mw = require('mw');
const gameList = ['garrysmod'];

module.exports = (router) => {
	router.post('/new', mw.checkLogin, request);
};

let request = (req, res, next) => {
	if (!req.body.port || !req.body.host || !req.body.game || !req.body.mod) {
		return next({msg: 'Обязательный параметры не были переданы', code: 200});
	}
	if (!~gameList.indexOf(req.body.game)) {
		return next({msg: 'Такая игра не поддерживается!', code: 200});
	}
	return Server.findOne({
		where: {
			host: req.body.host,
			port: req.body.port
		}
	}).then((server) => {
		if (server) {
			return next({msg: 'Такой сервер уже есть!', code: 200});
		}
		lgsl([{host: req.body.host, port: req.body.port, game: req.body.game}])
			.then((data) => {
				if (data[0].status === 'rejected') {
					return next({msg: 'Вы не можете добавить сервер который сейчас неактивен!', code: 200});
				}
				return Server.create({
						creater: +req.body.creater,
						host: req.body.host,
						port: req.body.port,
						game: req.body.game,
						mod: req.body.mod
					})
					.then((data) => {
						return res.send({status: 'success', server: data});
					});
			});
	}).catch(next);
};