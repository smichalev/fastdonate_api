const lgsl = require('lib/lib.lgsl');

// lgsl.findOne('173.199.67.252', 2305, 'garrysmod').then((data) => {
// 	console.log(data);
// }).catch((err) => {
// 	console.log('Ошибка' + err);
// });

lgsl([
	{host: '46.174.53.157', port: 7777, game: 'garrysmod'}, {
		host: '37.230.210.75',
		port: 27015,
		game: 'garrysmod'
	}
]).then(data => {
	console.log(data);
});
