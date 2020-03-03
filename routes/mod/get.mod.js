const Mod = require('models/mod.model');

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


	return Promise.all([
			Mod.findAll(query),
			Mod.count({})
		])
		.then(([mods, count]) => {
			let pages = Math.round(count / limit);
			res.send({status: 'success', mods, page: req.query.page, pages});
		})
		.catch((err) => next({}));
};