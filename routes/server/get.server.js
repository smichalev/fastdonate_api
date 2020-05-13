require('models/references');
const path = require('path');

const db = require('lib/lib.db').sequilize;
const config = require(path.join(__dirname, '..', '..', 'config'));
const {ApiError} = require('errors');

const Gameserver = require('models/gameserver.model');

module.exports = (router) => {
	router.get('/', request);
};

let request = async (req, res, next) => {
	let dbtransaction;
	let servers, count;
	let limit = 1;
	let query = {};
	
	try {
		dbtransaction = await db.transaction();
		let param = {transaction: dbtransaction};
		
		if (req.query.page) {
			if (!/^\d+$/.test(req.query.page) || req.query.page < 0) {
				return next(new ApiError(ApiError.CODES.INVALID_PARAMETERS));
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
		
		count = await Gameserver.count(Object.assign({}, param));
		servers = await Gameserver.findAll(Object.assign(query, param));
		
		let pages = Math.ceil(count / limit);
		
		if (!servers.length && count) {
			return next(new ApiError(ApiError.CODES.PAGE_NOT_FOUND));
		}
		
		let page;
		
		if (!req.query.page || req.query.page === 0 || req.query.page === 1) {
			page = 1;
		}
		else {
			page = req.query.page;
		}
		
		await dbtransaction.commit();
		
		return res.send({servers, page, pages});
	}
	catch (e) {
		if (dbtransaction) {
			await dbtransaction.rollback();
		}
		
		return next(e);
	}
};
