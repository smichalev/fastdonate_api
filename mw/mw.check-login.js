const path = require('path');

const {ApiError} = require('errors');

const User = require(path.join(__dirname, '..', 'models', 'user.model'));

module.exports = async (req, res, next) => {
	if (!req.session || !req.session.user) {
		return next(new ApiError(ApiError.CODES.SESSION_DIE));
	}
	
	let profile = req.session.user;
	let user;
	
	if (!profile || !profile.id || !profile.steamid || !profile.profile) {
		return next(new ApiError(ApiError.CODES.YOU_ARE_NOT_LOGIN));
	}
	
	try {
		user = await User.findOne({
			where: {
				id: profile.id,
				steamid: profile.steamid,
				profile: profile.profile,
			},
			raw: true,
		});
	}
	catch (e) {
		return next(e);
	}
	
	if (!user) {
		return next(new ApiError(ApiError.CODES.USER_NOT_FOUND));
	}
	
	return next();
};
