const Mod = require('models/mod.model');
const User = require('models/user.model');

require('models/references');

module.exports = (router) => {
	router.get('/', request);
};

let request = (req, res, next) => {
	let limit = 14;
	let query = {};
	if (req.query.page) {
		if (!/^\d+$/.test(req.query.page)) {
			return next({msg: 'Номер страницы может быть только числом.', code: 400});
		}
		req.query.page = +req.query.page;
		query.limit = limit;
		if (req.query.page === 0 || req.query.page === 1) {
			query.offset = 0;
		}
		else {
			query.offset = (req.query.page - 1) * query.limit;
		}
	}
	else {
		query.limit = limit;
		query.offset = 0;
	}
	query.include = [
		{
			association: 'Creator',
			attributes: ['id', 'login', 'avatar']
		}
	];

	return Promise.all([
		Mod.findAll(query),
		Mod.count({})
	])
		.then(([mods, count]) => {
			let pages = Math.ceil(count / limit);
			res.send({status: 'success', mods, page: req.query.page === 0 ? 1 : req.query.page, pages});
		})
		.catch((err) => next({}));
};