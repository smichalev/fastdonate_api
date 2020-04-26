const path = require('path');

const mw = require(path.join(__dirname, '..', '..', 'mw'));

const Event = require('models/event.model');

module.exports = (router) => {
	router.get('/count', mw.checkLogin, request);
};

let request = async (req, res, next) => {
	let count = await Event.count({
		where: {
			user: req.session.user.id,
			readed: false,
		},
	});
	
	return res.send({count});
};