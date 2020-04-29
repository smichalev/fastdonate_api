const path = require('path');

const config = require(path.join(__dirname, '..', '..', 'config'));
const mw = require(path.join(__dirname, '..', '..', 'mw'));
const {ApiError} = require('errors');

const User = require('models/user.model');

module.exports = (router) => {
	router.post('/', mw.checkLogin, request);
};

let request = async (req, res, next) => {
	if (!req.body.event || ['LOGOUT', 'AUTHORIZATION', 'POST_MOD'].indexOf(req.body.event) === -1) {
		return next(new ApiError(ApiError.CODES.INVALID_PARAMETERS));
	}
	
	let user = await User.findOne({
		where: {
			id: req.session.user.id,
		},
	});
	
	switch (req.body.event) {
		case 'LOGOUT':
			user.notify_logout = !user.notify_logout;
			req.session.user.notify_logout = user.notify_logout;
			req.session.save();
			await user.save();
			break;
		case 'AUTHORIZATION':
			user.notify_authorization = !user.notify_authorization;
			req.session.user.notify_authorization = user.notify_authorization;
			req.session.save();
			await user.save();
			break;
		case 'POST_MOD':
			user.notify_post_mod = !user.notify_post_mod;
			req.session.user.notify_post_mod = user.notify_post_mod;
			req.session.save();
			await user.save();
			break;
		default:
			return next(new ApiError(ApiError.CODES.INVALID_PARAMETERS));
	}
	
	return res.send('ok');
};