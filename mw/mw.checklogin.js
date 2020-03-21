const path = require('path');
const jwt = require('jsonwebtoken');
const config = require(path.join(__dirname, '..', 'config'));
const User = require(path.join(__dirname, '..', 'models', 'user.model'));
let msg = {msg: 'Для данного действия необходима авторизация', code: 401};

module.exports = async (req, res, next) => {
	if (!req.headers.authorization || req.headers.authorization.split('.').length !== 3) return next(msg);

	let profile;

	try {
		profile = await jwt.decode(req.headers.authorization, config.authorization.secretKey);
	} catch (e) {
		return next(msg);
	}

	if (!profile || !profile.id || !profile.steamid || !profile.profile) return next(msg);

	try {
		let user = await User.findOne({
			where: {
				id: profile.id,
				steamid: profile.steamid,
				profile: profile.profile
			},
			raw: true
		});

		if (!user) return next(msg);
		req.body.profile = user;

	} catch (e) {
		return next(msg);
	}
}