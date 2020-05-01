const uuid = require('uuid');
const path = require('path');
const upload = require('lib/lib.upload');

const event = require('data/events');
const db = require('lib/lib.db').sequilize;
const mw = require(path.join(__dirname, '..', '..', 'mw'));
const {ApiError} = require('errors');
const config = require(path.join(__dirname, '..', '..', 'config'));

const Mods = require('models/mod.model');
const Hash = require('models/hash.model');
const Hashmod = require('models/hashmod.model');
const Files = require('models/files.model');
const Event = require('models/event.model');

module.exports = (router) => {
	router.post('/', mw.checkLogin, request);
};

let request = async (req, res, next) => {
	let dbtransaction;
	
	let script, result, hashtags = [], promises = [], hashes = {};
	let {price, discount, version, title, description} = req.body;
	let hash = req.body.hash ? req.body.hash.split(',') : [];
	
	try {
		dbtransaction = await db.transaction();
		let param = {transaction: dbtransaction};
		
		if (!req.files || !req.files.mod) {
			return next(new ApiError(ApiError.CODES.REQUIRED_FIELD_IS_NOT_FILLED));
		}
		
		let imageMod = await upload(req.files.image, 'mod', 'image');
		let archiveMod = await upload(req.files.mod, 'mod', 'archive');
	
		for (let i = 0; i < hash.length; i++) {
			if (!!!~hashtags.indexOf(hash[i])) {
				hashtags.push(hash[i]);
			}
		}
		
		if (hashtags.length > config.settings.maxHashtags) {
			return next(new ApiError(ApiError.CODES.MANY_HASHTAG));
		}
		
		if (!req.session || !req.session.user || !req.session.user.id) {
			return next(new ApiError(ApiError.CODES.SESSION_DIE));
		}
		
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
		
		let randomID = uuid.v4();
		
		script = await Mods.create({
			id: randomID,
			creator,
			price,
			version,
			title,
			description,
			discount,
			cover: req.files.image ? imageMod : null,
		}, param);
		
		for (let i = 0; i < hashtags.length; i++) {
			promises.push(Hash.findOrCreate({
				defaults: {id: uuid.v4(), title: hashtags[i]},
				where: {title: hashtags[i]},
				raw: true,
			}));
		}
		
		result = await Promise.all(Object.assign(promises, param));
		
		promises = [];
		
		for (let i = 0; i < result.length; i++) {
			promises.push(Hashmod.findOrCreate({
				defaults: {mod_id: randomID, tag_id: result[i][0].id},
				where: {mod_id: randomID, tag_id: result[i][0].id},
			}));
		}
		
		await Promise.all(Object.assign(promises, param));
		
		promises = [];
		
		await Files.create({
			id: uuid.v4(),
			parent: randomID,
			creator,
			type: 'script',
			path: archiveMod,
		}, param);
		
		if (req.files.image) {
			await Files.create({
				id: uuid.v4(),
				parent: randomID,
				creator,
				type: 'cover',
				path: imageMod,
			}, param);
		}
		
		script = await Mods.findOne({
			where: {
				id: randomID,
			},
			include: [
				{
					association: 'Tags',
					required: false,
				},
			],
			...param,
		});
		await Event.create({
			id: uuid.v4(),
			user: req.session.user.id,
			type: event.SUCCESS.POST_MOD,
			data: {
				id: script.id,
				title: script.title,
			},
		});
		
		await dbtransaction.commit();
		
		return res.send({mod: script});
	}
	catch (e) {
		if (dbtransaction) {
			await dbtransaction.rollback();
		}
		
		return next(e);
	}
};
