const User = require('models/user.model');

module.exports = (router) => {
	router.get('/:id', request);
};

function request(req, res, next) {
	return User.findOne({
		where: {
			id: req.params.id
		}
	})
		.then((user) => {
			if (!user) {
				return next({msg: 'Пользователь не найден', code: 404});
			}
			res.send({status: 'success', user});
		})
		.catch((err) => next({}));
}