const Mods = require('models/mod.model');
const path = require('path');
const mw = require(path.join(__dirname, '..', '..', 'mw'));
const {ApiError} = require('errors');

module.exports = (router) => {
	router.put('/:id', mw.checkLogin, request);
};

async function request(req, res, next) {
	let script, result;
	try {
		script = await Mods.findOne({
			where: {
				id: req.params.id
			}
		})
	} catch (e) {
		return next(e);
	}

	if (!script) {
		return next(new ApiError(ApiError.CODES.SCRIPT_NOT_FOUND));
	}

	let {price, discount, version, title, description} = req.body;
	let creator = req.session.user.id;

	if (!price || !discount || !version || !title || !description || !creator) {
		return next(new ApiError(ApiError.CODES.REQUIRED_FIELD_IS_NOT_FILLED));
	}

	script.price = price;
	script.discount = discount;
	script.version = version;
	script.title = title;
	script.description = description;

	try {
		if (req.body.profile.role === 'ADMIN') {
			result = await mod.save();
			return res.json({mod: result})
		}
		else {
			if (req.body.profile.id !== mod.creator) {
				return next(new ApiError(ApiError.CODES.NOT_ENOUGH_RIGHTS));
			}
			else {
				result = await mod.save();
				return res.json({mod: result})
			}
		}
	} catch (e) {
		return next(e);
	}
}