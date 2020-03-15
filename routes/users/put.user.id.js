const Server = require('models/server.model');
const path = require('path');
const mw = require(path.join(__dirname, '..', '..', 'mw'));

module.exports = (router) => {
	router.put('/:id', mw.checkLogin, request);
};

function request(req, res, next) {
	return Server.findOne({
			where: {
				id: req.params.id
			}
		})
		.then((server) => {
			if (!server) {
				return next({msg: 'Сервер не найден', code: 404});
			}

			let {price, discount, version, title, description} = req.body;
			let creator = req.body.profile.id;

			if (!price || !discount || !version || !title || !description || !creator) {
				return next({msg: 'Не все параметры переданы', code: 400});
			}

			server.price = price;
			server.discount = discount;
			server.version = version;
			server.title = title;
			server.description = description;

			if (req.body.profile.role === 'ADMIN') {
				return server.save().then((data) => {
					res.send({status: 'success', server: data});
				});
			}
			else {
				if (req.body.profile.id !== server.creator) {
					return next({msg: 'У Вас нет прав для изменения этой модификации.', code: 400});
				}
				return server.save().then((data) => {
					res.send({status: 'success', server: data});
				});
			}
		})
		.catch((err) => next({}));
}