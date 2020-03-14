const Mods = require('models/mod.model');
const path = require('path');
const mw = require(path.join(__dirname, '..', '..', 'mw'));

module.exports = (router) => {
	router.put('/:id', mw.checkLogin, request);
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

			let {price, discount, version, title, description} = req.body;
			let creator = req.body.profile.id;

			if (!price || !discount || !version || !title || !description || !creator) {
				return next({msg: 'Не все параметры переданы', code: 400});
			}

			mod.price = price;
			mod.discount = discount;
			mod.version = version;
			mod.title = title;
			mod.description = description;

			if (req.body.profile.role === 'ADMIN') {
				return mod.save().then((data) => {
					res.send({status: 'success', mod: data});
				});
			}
			else {
				if (req.body.profile.id !== mod.creator) {
					return next({msg: 'У Вас нет прав для изменения этой модификации.', code: 400});
				}
				return mod.save().then((data) => {
					res.send({status: 'success', mod: data});
				});
			}
		})
		.catch((err) => next({}));
}