const Server = require('models/server.model');
const mw = require('mw');

module.exports = (router) => {
	router.get('/list', request);
};

let request = (req, res, next) => {
	return Server.findAll({})
		.then((servers) => {
			return res.status(200).send({status: 'success', servers});
		})
		.catch((err) => next(err));
};