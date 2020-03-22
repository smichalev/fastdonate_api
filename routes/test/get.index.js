const {ApiError} = require('errors');
const path = require('path');
const checkLogin = require('../../mw/mw.checklogin');

module.exports = (router) => {
	router.get('/', checkLogin, request);
};

function request(req, res, next) {
	res.json({profile: req.body.profile})
};