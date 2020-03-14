const Mods = require('models/mod.model');
const path = require('path');
const mw = require(path.join(__dirname, '..', '..', 'mw'));
const uuid = require('uuid');

module.exports = (router) => {
	router.post('/', mw.checkLogin, request);
};

function request(req, res, next) {
	let {price, sale, version, title, description} = req.body;
	let creater = req.body.profile.id;
	let ver = ['alfa', 'beta', 'final'];
	if (!price || !version || !title || !description || !creater || !sale) {
		return next({msg: 'Не все параметры переданы', code: 400});
	}
	price = +price;
	sale = +sale;
	if (!/^\d+$/.test(price)) {
		return next({msg: 'Цена может быть только числом', code: 400});
	}
	if (price < 0) {
		return next({msg: 'Цена не может быть отрицательным значением', code: 400});
	}
	if (!/^\d+$/.test(sale)) {
		return next({msg: 'Процент скидки может быть только числом', code: 400});
	}
	if (sale > 100) {
		return next({msg: 'Скидка не может быть больше 100 процентов', code: 400});
	}
	if (sale < 0) {
		return next({msg: 'Скидка не может быть отрицательным значением', code: 400});
	}
	if (!~ver.indexOf(version)) {
		return next({msg: 'Версия модиикации может быть только ALFA, BETA или FINAL', code: 400});
	}


	return Mods.create({
		id: uuid.v4(),
		creater,
		price,
		version,
		title,
		description,
		sale
	})
		.then((mod) => {
			res.send({status: 'success', mod});
		})
		.catch((err) => next({}));
}