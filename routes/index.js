const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('config');
const path = require('path');
const User = require(path.join(__dirname, '..', 'models', 'user.model'));

module.exports = (app, express) => {
	app.use(passport.initialize());
	app.use('/api/auth', require('./auth'));
	app.use('/api/mod', require('./mod'));
	app.use('/api/servers', require('./servers'));
	app.use('/api/users', require('./users'));
	app.get('/api/', (req, res) => {
		res.render('index');
	});
	app.use('/api/images', express.static(path.join(__dirname, '..', 'images')));
	app.get('/api/profile', (req, res, next) => {
		if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
			return Promise.resolve()
				.then(() => {
					return jwt.decode(req.headers.authorization.split(' ')[1], config.authorization.secretKey);
				})
				.then((profile) => {
					if (!profile) {
						return next({msg: 'Пользователь не найден', code: 404});
					}
					return User.findOne({
						where: {
							id: profile.id
						},
						raw: true
					})
						.then((data) => {
							if (!data) {
								return res.status(200).send({status: 'success', profile: {}});
							}
							return res.status(200).send({status: 'success', profile: data});
						})
						.catch(() => {
							return res.status(200).send({status: 'success', profile: {}});
						});
				})
				.catch((err) => {
					console.log(err);
				});
		}
		else {
			return next({msg: 'Неверно переданы параметры', code: 400});
		}
	});
	app.use((err, req, res, next) => {
		if (err) {
			let msg = err.msg || 'Unknown error';
			let code = err.code || 500;
			res.status(code).send({status: 'error', msg});
		}
		else {
			return next();
		}
	});

	app.use((req, res) => {
		res.status(404).send({status: 'error', msg: 'Not correct query API'});
	});
};