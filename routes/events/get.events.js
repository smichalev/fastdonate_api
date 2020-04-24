const path = require('path');

const config = require(path.join(__dirname, '..', '..', 'config'));
const mw = require(path.join(__dirname, '..', '..', 'mw'));
const {ApiError} = require('errors');

const User = require('models/user.model');
const Event = require('models/event.model');

module.exports = (router) => {
	router.get('/', mw.checkLogin, request);
};

let request = async (req, res, next) => {
	let query = {};
	let limit = config.settings.maxCountElementOnPage;
	
	try {
		let user = await User.findOne({
			where: {
				id: req.session.user.id,
			},
		});
		
		if (!user) {
			return next(new ApiError(ApiError.CODES.USER_NOT_FOUND));
		}
		
		if (req.query.page) {
			if (!/^\d+$/.test(req.query.page) || req.query.page < 0) {
				return next(new ApiError(ApiError.CODES.INVALID_PARAMETERS));
			}
			
			req.query.page = +req.query.page;
			query.limit = limit;
			
			if (req.query.page === 0 || req.query.page === 1) {
				query.offset = 0;
			}
			else {
				query.offset = (req.query.page - 1) * query.limit;
			}
		}
		else {
			query.limit = limit;
			query.offset = 0;
		}
		
		query.order = [['createdAt', 'DESC']];
		
		let count = await Event.count({
			where: {
				user: req.session.user.id,
			},
		});
		let events = await Event.findAll(query);
		
		for (let i = 0; i < events.length; i++) {
			if (!events[i].readed) {
				events[i].readed = true;
				await events[i].save();
			}
		}
		
		return res.send({events, count});
	}
	catch (e) {
		return next(e);
	}
};