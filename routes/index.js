const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = (app) => {
	app.use(passport.initialize());
	app.use('/api/auth', require('./auth'));
	app.use('/api/server', require('./server'));
	app.get('/api/', (req, res) => {
		res.render('index');
	});
	app.get('/api/profile', async (req, res) => {
		if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
			let profile = await jwt.decode(req.headers.authorization.split(' ')[1], config.authorization.secretKey);
			return res.status(200).send({status: 'success', profile: profile ? profile : {}});
		}
		else {
			res.status(200).send({status: 'success', profile: {}});
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