const router = require('express').Router();
const path = require('path');
const fs = require('fs');

fs.readdirSync(__dirname)
	.filter((filename) => filename !== 'index.js')
	.forEach((filename) => require(path.resolve(__dirname, filename.slice(0, -3)))(router));

module.exports = router;