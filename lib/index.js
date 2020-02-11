const fs = require('fs');
const path = require('path');

let filelist = fs.readdirSync(path.join(__dirname)).filter((file) => file !== 'index.js');

let lib = {};

for (let i = 0; i < filelist.length; i++) {
	let name = filelist[i].split('.');
	if (name[0] === 'lib' && name[2] === 'js') {
		lib[name[1]] = require(path.join(__dirname, filelist[i]));
	}
}

module.exports = lib;