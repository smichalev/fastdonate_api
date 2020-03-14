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
	// let profileurl = req.user._json.steamid.split('/')[4];
	let profileurl = req.user._json.steamid;

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
			console.log(result);
			console.log(result.dataValues, config.authorization.secretKey);
			console.log(token);
			res.status(302).render('authorization', {token});
		})
		.catch((err) => next(err));
}