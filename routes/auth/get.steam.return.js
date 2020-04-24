const path = require('path');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const uuid = require('uuid');

const event = require('data/events');
const db = require('lib/lib.db').sequilize;
const config = require(path.join(__dirname, '..', '..', 'config'));
const {ApiError} = require('errors');

const User = require('models/user.model');
const Event = require('models/event.model');

module.exports = (router) => {
	router.get('/steam/return', passport.authenticate('steam', {failureRedirect: '/'}), request);
};

let request = async (req, res, next) => {
	let dbtransaction;
	
	try {
		dbtransaction = await db.transaction();
		let param = {transaction: dbtransaction};
		
		let {steamid, personaname, avatarfull, loccountrycode} = req.user._json,
			profileurl = req.user._json.steamid,
			user,
			token,
			result;
		
		user = await User.findOne({
			where: {
				steamid: steamid,
			},
			...param,
		});
		
		if (!user) {
			result = await User.create({
				id: uuid.v4(),
				steamid,
				login: personaname,
				profile: profileurl,
				avatar: avatarfull,
				country: loccountrycode,
			}, param);
			
			await Event.create({
				id: uuid.v4(),
				user: result.dataValues.id,
				type: event.SUCCESS.RECRUIT,
			});
		}
		else {
			user.login = personaname;
			user.avatar = avatarfull;
			user.country = loccountrycode;
			result = await user.save(param);
		}
		
		await Event.create({
			id: uuid.v4(),
			user: result.dataValues.id,
			type: event.SUCCESS.AUTHORIZATION,
		});
		
		if (!result) {
			return next(new ApiError(ApiError.CODES.UNKNOWN_ERROR));
		}
		
		req.session.user = result.dataValues;
		req.session.save();
		
		token = await jwt.sign(result.dataValues, config.authorization.secretKey);
		token = `Bearer ${ token }`;
		
		await dbtransaction.commit();
		
		return res.status(302).render('authorization', {token});
	}
	catch (e) {
		if (dbtransaction) {
			await dbtransaction.rollback();
		}
		
		return next(e);
	}
};
