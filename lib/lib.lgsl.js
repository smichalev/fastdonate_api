const gameServer = require('game-server-query');

// arr = [{host: 1.2.3.4, port: 1234, game: 'garrysmod'}, ...]

let lgsl = (arr) => {
	let Promises = [];

	for (let i = 0; i < arr.length; i++) {
		let server = {
			host: `${ arr[i].host }:${ arr[i].port }`,
			type: arr[i].game
		};

		Promises.push(new Promise((resolve, reject) => {
			gameServer(server, (state) => {
				state.error ? reject('error') : resolve(state);
			});
		}));
	}

	return Promise.allSettled(Promises);
};

module.exports = lgsl;