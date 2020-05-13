const uuid = require('uuid');
const path = require('path');
const lgsl = require('lib/lib.lgsl');
const {ApiError} = require('errors');
const gameList = require('data/server');
const Gameserver = require('models/gameserver.model');

const mw = require(path.join(__dirname, '..', '..', 'mw'));

module.exports = (router) => {
	router.post('/new', mw.checkLogin, request);
};

let request = async (req, res, next) => {
	if (!req.body.server || !req.body.server.query.host || !req.body.server.query.port || !req.body.server.gamename) {
		return next(new ApiError(ApiError.CODES.INVALID_PARAMETERS));
	}
	
	if (!/^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]?)$/.test(req.body.server.query.host)) {
		return next(new ApiError(ApiError.CODES.NOT_CORRECT_IP));
	}
	
	if (!parseInt(req.body.server.query.port) > 0 || +req.body.server.query.port < 0 || +req.body.server.query.port > 65536) {
		return next(new ApiError(ApiError.CODES.NOT_CORRECT_PORT));
	}
	
	if (gameList.indexOf(req.body.server.gamename) === -1) {
		return next(new ApiError(ApiError.CODES.NOT_CORRECT_GAME));
	}
	
	lgsl([{host: req.body.server.query.host, port: req.body.server.query.port, game: req.body.server.gamename}]).then((data) => {
		if (data[0].status === 'rejected') {
			return next(new ApiError(ApiError.CODES.GAME_SERVER_OFF));
		}
		if (data[0].status === 'fulfilled') {
			return Gameserver.findOne({
					where: {
						ip: data[0].value.query.host,
						port: data[0].value.query.port,
						gamename: data[0].value.query.type,
					},
				})
				.catch((err) => {
					return next(err);
				})
				.then((server) => {
					if (!server) {
						return Gameserver.create({
								id: uuid.v4(),
								user: req.session.user.id,
								name: data[0].value.name,
								gamename: data[0].value.query.type,
								map: data[0].value.map,
								ip: data[0].value.query.host,
								port: data[0].value.query.port,
								player: data[0].value.players.length,
								maxplayers: data[0].value.maxplayers,
								data: {
									raw: Object.assign(data[0].value.raw, {password: data[0].value.password}),
									players: Object.assign(data[0].value.players, data[0].value.bots),
									query: data[0].value.query,
								},
							})
							.then((data) => {
								return res.send(data);
							})
							.catch((err) => {
								return next(err);
							});
					}
					else {
						return next(new ApiError(ApiError.CODES.SERVER_RUNNING));
					}
				});
		}
	});
};