const Mods = require('models/mod.model');
const path = require('path');
const mw = require(path.join(__dirname, '..', '..', 'mw'));
const uuid = require('uuid');

module.exports = (router) => {
	router.post('/', mw.checkLogin, request);
};

function request(req, res, next) {
	let {price, discount, version, title, description} = req.body;
	let creator = req.body.profile.id;

	console.log(title , description, version, creator, isNaN(price), price, isNaN(discount), discount);
	price = +price;
	discount = +discount;

	if(!title || !description || !version || !creator || isNaN(price) || isNaN(discount))
		return next({msg: 'Не заполнено обязательное поле!', code: 400});

	if(price < 0)
		return next({msg: 'Неверно указана цена товара!', code: 400});
	
	if(price === 0) 
		discount = 0;
	else
		if(discount < 0 || discount > 100)
			return next({msg: 'Неверно указан процент скидки!', code: 400});

	return Mods.create({
		id: uuid.v4(),
		creator,
		price,
		version,
		title,
		description,
		discount
	})
		.then((mod) => {
			res.send({status: 'success', mod});
		})
		.catch((err) => next({msg: err, code: 400}));
}