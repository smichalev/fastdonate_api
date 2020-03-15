const Server = require('models/server.model');
const User = require('models/user.model');

module.exports = (router) => {
	router.get('/:id', request);
};

function request(req, res, next) {
	return Server.findOne({
		where: {
			id: req.params.id
		},
		include: [
			{
				association: 'Creator'
			}
		]
	})
		.then((server) => {
			if (!server) {
				return next({msg: 'Модификация не найдена', code: 404});
			}
			res.send({status: 'success', server});
		})
		.catch((err) => next({}));
}