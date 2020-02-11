const passport = require('passport');
const config = require('./../../config');
const jwt = require('jsonwebtoken');

module.exports = (router) => {
	router.get('/steam/return', passport.authenticate('steam', {failureRedirect: '/'}), request);
};

function request(req, res, next) {
	res.render('authorization', {token: jwt.sign(req.user._json, config.authorization.secretKey)});
}