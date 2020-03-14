const Mods = require('models/mod.model');
const path = require('path');
const mw = require(path.join(__dirname, '..', '..', 'mw'));

module.exports = (router) => {
	router.delete('/:id', mw.checkLogin, request);
};

function request(req, res, next) {
	return Mods.findOne({
			where: {
				id: req.params.id
			}
		})
		.then((mod) => {
			if (!mod) {
				return next({msg: 'Модификация не была найдена. Удаление невозможно.', code: 404});
			}
			if (req.body.profile.role === 'ADMIN') {
				return mod.destroy().then(() => {
					return next({msg: 'Модификация успешно удалена.', code: 200});
				});
			}
			else {
				if (mod.creator !== req.body.profile.id) {
					return next({msg: 'У Вас нет прав для удаления этой модификации.', code: 400});
				}
				return mod.destroy();
			}
		})
		.then(() => next({msg: 'Модификация успешно удалена.', code: 404}))
		.catch((err) => next({}));
}