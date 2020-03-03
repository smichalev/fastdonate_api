const Mods = require('models/mod.model');

module.exports = (router) => {
	router.get('/:id', request);
};

function request(req, res, next) {
	return Mods.findOne({
			where: {
				id: req.params.id
			}
		})
		.then((mod) => {
			if (!mod) {
				return next({msg: 'Модификация не найдена', code: 404});
			}
			res.send({status: 'success', mod});
		})
		.catch((err) => next({}));
}