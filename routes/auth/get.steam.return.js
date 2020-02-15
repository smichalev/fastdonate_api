const passport = require('passport');
const config = require('./../../config');
const jwt = require('jsonwebtoken');
const User = require('models/user.model');

module.exports = (router) => {
	router.get('/steam/return', passport.authenticate('steam', {failureRedirect: '/'}), request);
};

function request(req, res, next) {
	return User.findOne({
			where: {
				steamid: req.user._json.steamid
			}
		})
		.then((user) => {
			if (!user) {
				return User.create({
					steamid: req.user._json.steamid,
					login: req.user._json.personaname,
					profile: req.user._json.profileurl,
					avatar: req.user._json.avatarfull,
					country: req.user._json.loccountrycode
				});
			}
			user.login = req.user._json.personaname;
			user.avatar = req.user._json.avatarfull;
			user.country = req.user._json.loccountrycode;
			return user.save();
		})
		.then((user) => {
			if (user) {
				res.render('authorization', {token: jwt.sign(user.dataValues, config.authorization.secretKey)});
			}
		})
		.catch((err) => next(err));
}