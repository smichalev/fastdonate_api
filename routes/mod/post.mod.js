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

	if (!price || !sale || !version || !title || !description || !creater) {
		return next({msg: 'Не все параметры переданы', code: 400});
	}

	return Mods.create({
			id: uuid.v4(),
			creater,
			price,
			version,
			title,
			description
		})
		.then((mod) => {
			res.send({status: 'success', mod});
		})
		.catch((err) => next({}));
}