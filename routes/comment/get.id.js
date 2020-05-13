const db = require('lib/lib.db').sequilize;

const {ApiError} = require('errors');

const Comments = require('models/comments.model');
const Mod = require('models/mod.model');

module.exports = (router) => {
	router.get('/:id', request);
};

let request = async (req, res, next) => {
	try {
		let comments, mod;
		
		mod = await Mod.count({
			where: {
				id: req.params.id,
			},
		});
		
		if (!mod) {
			return next(new ApiError(ApiError.CODES.SCRIPT_NOT_FOUND));
		}
		
		comments = await Comments.findAll({
			where: {
				essence: req.params.id,
				parent: null,
			},
			include: [
				{
					association: 'Creator',
					attributes: ['id', 'login', 'avatar', 'role', 'country'],
				},
			],
			order: [['createdAt', 'ASC']],
		});
		
		return res.send({comments});
	}
	catch (e) {
		return next(e);
	}
};
