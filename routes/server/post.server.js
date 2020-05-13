const path = require('path');
const lgsl = require('lib/lib.lgsl');
const {ApiError} = require('errors');
const gameList = require('data/server');

const mw = require(path.join(__dirname, '..', '..', 'mw'));

module.exports = (router) => {
	router.post('/', mw.checkLogin, request);
};

let request = async (req, res, next) => {
	if (!req.body.ip || !req.body.port || !req.body.game) {
		return next(new ApiError(ApiError.CODES.INVALID_PARAMETERS));
	}
	
	if (!/^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]?)$/.test(req.body.ip)) {
		return next(new ApiError(ApiError.CODES.NOT_CORRECT_IP));
	}
	
	if (!parseInt(req.body.port) > 0 || +req.body.port < 0 || +req.body.port > 65536) {
		return next(new ApiError(ApiError.CODES.NOT_CORRECT_PORT));
	}
	
	if (gameList.indexOf(req.body.game) === -1) {
		return next(new ApiError(ApiError.CODES.NOT_CORRECT_GAME));
	}
	
	lgsl([{host: req.body.ip, port: req.body.port, game: req.body.game}]).then((data) => {
		if (data[0].status === 'rejected') {
			return next(new ApiError(ApiError.CODES.GAME_SERVER_OFF));
		}
		if (data[0].status === 'fulfilled') {
			return res.send({server: data[0].value});
		}
	});
};