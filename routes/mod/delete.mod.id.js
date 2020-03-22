const Mods = require('models/mod.model');
const path = require('path');
const mw = require(path.join(__dirname, '..', '..', 'mw'));
const {ApiError} = require('errors');

module.exports = (router) => {
	router.delete('/:id', mw.checkLogin, request);
};

async function request(req, res, next) {
	let mod;
	try {
		mod = await Mods.findOne({
			where: {
				id: req.params.id
			}
		})
	} catch (e) {
		return next(e);
	}
	if (!mod) {
		return next(new ApiError(ApiError.CODES.SCRIPT_NOT_FOUND));
	}
	try {
		if (req.body.profile.role === 'ADMIN') {
			await mod.destroy();
			return res.json({message: 'Модификация успешно удалена'});
		}
		else {
			if (mod.creator !== req.session.user.id) {
				return next(new ApiError(ApiError.CODES.NOT_ENOUGH_RIGHTS));
			}
			else {
				await mod.destroy();
				return res.json({message: 'Модификация успешно удалена'});
			}
		}
	} catch (e) {
		return next(e);
	}
}