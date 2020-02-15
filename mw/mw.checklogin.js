const config = require('config');
const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
	if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
		let profile = await jwt.decode(req.headers.authorization.split(' ')[1], config.authorization.secretKey);
		if (profile) {
			req.body.creater = profile.steamid;
			return next();
		}
		next({msg: 'token not valid', code: 401});
	}
	return next({msg: 'token not valid', code: 401});
};