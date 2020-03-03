const path = require('path');
const passport = require('passport');
const config = require(path.join(__dirname, '..', '..', 'config'));
const jwt = require('jsonwebtoken');
const User = require('models/user.model');
const uuid = require('uuid');

module.exports = (router) => {
	router.get('/steam/return', passport.authenticate('steam', {failureRedirect: '/'}), request);
};

function request(req, res, next) {
	let {steamid, personaname, avatarfull, loccountrycode} = req.user._json;
	let profileurl = req.user._json.profileurl.split('/')[4];

	return User.findOne({
			where: {
				steamid: steamid
			}
		})
		.then((user) => {
			if (!user) {
				return User.create({
					id: uuid.v4(),
					steamid,
					login: personaname,
					profile: profileurl,
					avatar: avatarfull,
					country: loccountrycode
				});
			}
			user.login = personaname;
			user.avatar = avatarfull;
			user.country = loccountrycode;
			return user.save();
		})
		.then((result) => {
			let token = jwt.sign(result.dataValues, config.authorization.secretKey);
			res.render('authorization', {token});
		})
		.catch((err) => next(err));
}