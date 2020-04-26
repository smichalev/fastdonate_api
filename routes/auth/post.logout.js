const uuid = require('uuid');
const event = require('data/events');
const Event = require('models/event.model');

module.exports = (router) => {
	router.post('/logout', request);
};

let request = async (req, res, next) => {
	try {
		if (req.session.user) {
			await Event.create({
				id: uuid.v4(),
				user: req.session.user.id,
				type: event.SUCCESS.LOGOUT,
			});
			delete req.session.user;
			req.logout();
			req.session.save();
		}
		
		return res.json({message: 'ok'});
	}
	catch (e) {
		return next(e);
	}
};
