const Mods = require('models/mod.model');
const {ApiError} = require('errors');

module.exports = (router) => {
	router.get('/:id', request);
};

async function request(req, res, next) {
	let mod;
	try {
		mod = await Mods.findOne({
			where: {
				id: req.params.id
			},
			include: [
				{
					association: 'Creator'
				}
			]
		})
	} catch (e) {
		return next(e);
	}

	if (!mod) {
		return next(new ApiError(ApiError.CODES.SCRIPT_NOT_FOUND));
	}
	return res.send({mod});
}