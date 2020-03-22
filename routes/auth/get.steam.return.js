const path = require('path');
const passport = require('passport');
const config = require(path.join(__dirname, '..', '..', 'config'));
const jwt = require('jsonwebtoken');
const User = require('models/user.model');
const uuid = require('uuid');
const {ApiError} = require('errors');

module.exports = (router) => {
	router.get('/steam/return', passport.authenticate('steam', {failureRedirect: '/'}), request);
};

async function request(req, res, next) {
	let {steamid, personaname, avatarfull, loccountrycode} = req.user._json;
	let profileurl = req.user._json.steamid;
	let user, result, token;

	try {
		user = await User.findOne({
			where: {
				steamid: steamid
			}
		});
	} catch (e) {
		return next(e);
	}

	if (!user) {
		try {
			result = await User.create({
				id: uuid.v4(),
				steamid,
				login: personaname,
				profile: profileurl,
				avatar: avatarfull,
				country: loccountrycode
			});
		} catch (e) {
			return next(e);
		}
	}
	else {
		try {
			user.login = personaname;
			user.avatar = avatarfull;
			user.country = loccountrycode;
			result = await user.save();
		} catch (e) {
			return next(e)
		}
	}

	if (!result) {
		return next(new ApiError(ApiError.CODES.UNKNOWN_ERROR));
	}

	try {
		req.session.user = result.dataValues;
		req.session.save();
		token = await jwt.sign(result.dataValues, config.authorization.secretKey);
		token = `Bearer ${token}`;
		return res.status(302).render('authorization', {token});
	} catch (e) {
		return next(e);
	}
}