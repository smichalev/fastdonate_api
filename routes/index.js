const passport = require('passport');
const path = require('path');
const {ApiError} = require('errors');

const User = require(path.join(__dirname, '..', 'models', 'user.model'));
const dictionary = {
	RU: require(path.join(__dirname, '..', 'locales', 'ru.json')),
	EN: require(path.join(__dirname, '..', 'locales', 'en.json')),
};

module.exports = (app, express) => {
	app.use(passport.initialize());
	app.get('/api/ws', (req, res, next) => {
		req.app.io.emit('profile', 'zalupa');
		res.send('ok');
	});
	app.get('/api/login', (req, res, next) => {
		let result = req.session.user ? true : false;
		return res.status(200).send({result});
	});
	app.get('/api/lang', (req, res, next) => {
		let lang = ['ru', 'en', 'fr', 'gr', 'sp', 'ch'].indexOf(req.session.lang) === -1 ? 'en' : req.session.lang;
		return res.status(200).send({lang});
	});
	app.post('/api/lang', (req, res, next) => {
		if (!req.body.lang || ['ru', 'en', 'fr', 'gr', 'sp', 'ch'].indexOf(req.body.lang) === -1) {
			return next(new ApiError(ApiError.CODES.INVALID_PARAMETERS));
		}
		
		req.session.lang = req.body.lang;
		req.session.save();
		
		return res.status(200).send({lang: req.body.lang});
	});
	app.use('/api/auth', require(path.join(__dirname, 'auth')));
	app.use('/api/mod', require(path.join(__dirname, 'mod')));
	app.use('/api/events', require(path.join(__dirname, 'events')));
	app.use('/api/comment', require(path.join(__dirname, 'comment')));
	app.use('/api/users', require(path.join(__dirname, 'users')));
	app.use('/api/server', require(path.join(__dirname, 'server')));
	app.get('/api/', (req, res) => {
		res.render('index');
	});
	app.use('/api/images', express.static(path.join(__dirname, '..', 'images')));
	app.get('/api/profile', async (req, res, next) => {
		if (!req.session || !req.session.user) {
			return next(new ApiError(ApiError.CODES.SESSION_DIE));
		}
		
		let profile = req.session.user;
		let user;
		
		try {
			user = await User.findOne({
				where: {
					id: profile.id,
				},
				raw: true,
			});
		}
		catch (e) {
			return next(e);
		}
		
		if (!user) {
			return next(new ApiError(ApiError.CODES.USER_NOT_FOUND));
		}
		
		return res.status(200).send({profile: user});
	});
	app.use((err, req, res, next) => {
		if (!err) {
			return next();
		}
		
		let lang = 'EN';
		
		if (req.session && req.session.user && req.session.user.country) {
			if (req.session.user.country === 'RU') {
				lang = req.session.user.country;
			}
		}
		
		let response = {};
		
		if (err.code !== null && err.code !== 'undefined') {
			response.code = err.code;
		}
		
		let message = err.message || 'Unknown error';
		let status = err.status || 500;
		
		if (dictionary[lang].errors[message]) {
			response.message = dictionary[lang].errors[message];
		}
		else {
			response.message = message;
		}
		
		return res.status(status).send(response);
	});
	
	app.use((req, res) => {
		let lang = 'EN';
		
		if (req.session && req.session.user && req.session.user.country) {
			if (req.session.user.country === 'RU') {
				lang = req.session.user.country;
			}
		}
		
		let error = new ApiError(ApiError.CODES.NOT_FOUND);
		
		if (dictionary[lang].errors[error.message]) {
			error.message = dictionary[lang].errors[error.message];
		}
		
		return res.status(error.status).send({message: error.message});
	});
};
