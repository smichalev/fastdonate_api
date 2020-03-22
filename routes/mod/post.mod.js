const Mods = require('models/mod.model');
const path = require('path');
const mw = require(path.join(__dirname, '..', '..', 'mw'));
const uuid = require('uuid');
const {ApiError} = require('errors');

module.exports = (router) => {
	router.post('/', mw.checkLogin, request);
};

async function request(req, res, next) {
	let script;
	let {price, discount, version, title, description} = req.body;
	let creator = req.session.user.id;

	price = +price;
	discount = +discount;

	if (!title || !description || !version || !creator || isNaN(price) || isNaN(discount)) {
		return next(new ApiError(ApiError.CODES.REQUIRED_FIELD_IS_NOT_FILLED));
	}

	if (price < 0) {
		return next(new ApiError(ApiError.CODES.INVALID_PRODUCT_PRICE));
	}

	if (price === 0) {
		discount = 0;
	}
	else if (discount < 0 || discount > 100) {
		return next(new ApiError(ApiError.CODES.INVALID_DISCOUNT_PERCENTAGE));
	}

	try {
		script = await Mods.create({
			id: uuid.v4(),
			creator,
			price,
			version,
			title,
			description,
			discount
		});
	} catch (e) {
		return next(e);
	}

	return res.send({mod: script});
}