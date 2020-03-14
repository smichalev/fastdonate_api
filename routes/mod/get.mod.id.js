const Mods = require('models/mod.model');
const User = require('models/user.model');

module.exports = (router) => {
	router.get('/:id', request);
};

function request(req, res, next) {
	return Mods.findOne({
		where: {
			id: req.params.id
		},
		include: [
			{
				association: 'Creater'
			}
		]
	})
		.then((mod) => {
			if (!mod) {
				return next({msg: 'Модификация не найдена', code: 404});
			}
			res.send({status: 'success', mod});
		})
		.catch((err) => next({}));
}