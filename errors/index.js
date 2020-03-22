const path = require('path');
const fs = require('fs');
const {camelCase} = require('camel-case');

fs.readdirSync(__dirname)
	.filter((filename) => filename !== 'index.js')
	.forEach((filename) => {
		let name = camelCase(filename.slice(0, -3));
		name = name[0].toUpperCase() + name.slice(1);
		module.exports[name] = require(path.resolve(__dirname, filename.slice(0, -3)));
	});