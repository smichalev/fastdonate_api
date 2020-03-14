const path = require('path');
const config = require(path.join(__dirname, '..', 'config'));
const jwt = require('jsonwebtoken');
const User = require(path.join(__dirname, '..', 'models', 'user.model'));
let msg = {msg: 'Для данного действия необходима авторизация', code: 401};

module.exports = async (req, res, next) => {
	if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer' && req.headers.authorization.split(' ').length === 2) {
		let profile = await jwt.decode(req.headers.authorization.split(' ')[1], config.authorization.secretKey);
		if (!profile) {
			return next(msg);
		}

		return User.findOne({
				where: {
					id: profile.id,
					steamid: profile.steamid,
					profile: profile.profile
				},
				raw: true
			})
			.then((user) => {
				if (!user) {
					return next(msg);
				}
				req.body.profile = user;
				return next();
			})
			.catch((err) => {
				return next(msg);
			});
	}
	else {
		return next(msg);
	}
};