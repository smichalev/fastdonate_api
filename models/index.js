const fs = require('fs');
const path = require('path');

let filelist = fs.readdirSync(path.join(__dirname)).filter((file) => file !== 'index.js');

let models = {};

for (let i = 0; i < filelist.length; i++) {
	let name = filelist[i].split('.');
	if (name[name.length - 2] === 'model' && name[name.length - 1] === 'js') {
		models[name[0]] = require(path.join(__dirname, filelist[i]));
	}
}

module.exports = models;