const Server = require('models/server.model');
const path = require('path');
const mw = require(path.join(__dirname, '..', '..', 'mw'));
const uuid = require('uuid');

module.exports = (router) => {
	router.post('/', mw.checkLogin, request);
};

function request(req, res, next) {
	let {port, host, game, mod} = req.body;
	let creator = req.body.profile.id;

	port = +port;

	console.log(host, game, mod,creator,isNaN(port));

	if(!host || !game || !mod || !creator || isNaN(port))
		return next({msg: 'Не заполнено обязательное поле!', code: 400});

	if(port < 0 || port > 65535)
		return next({msg: 'Неверно указан порт!', code: 400});

	return Server.create({
		id: uuid.v4(),
		creator,
		port,
		host,
		game,
		mod
	})
		.then((server) => {
			res.send({status: 'success', server});
		})
		.catch((err) => next({msg: err, code: 400}));
}