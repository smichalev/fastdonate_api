const Server = require('models/server.model');
const path = require('path');
const mw = require(path.join(__dirname, '..', '..', 'mw'));

module.exports = (router) => {
	router.delete('/:id', mw.checkLogin, request);
};

function request(req, res, next) {
	return Server.findOne({
			where: {
				id: req.params.id
			}
		})
		.then((server) => {
			if (!server) {
				return next({msg: 'Сервер не найден. Удаление невозможно.', code: 404});
			}
			if (req.body.profile.role === 'ADMIN') {
				return server.destroy().then(() => {
					return next({msg: 'Сервер успешно удален.', code: 200});
				});
			}
			else {
				if (server.creator !== req.body.profile.id) {
					return next({msg: 'У Вас нет прав для удаления этого сервера.', code: 400});
				}
				return server.destroy();
			}
		})
		.then(() => next({msg: 'Сервер успешно удален.', code: 404}))
		.catch((err) => next({}));
}