const fs = require('fs');
const path = require('path');
const {ApiError} = require('errors');
const config = require('config');

let folder = {
	mod: {
		maxSize: {
			image: config.files.maxSizeImage,
			archive: config.files.maxSizeImage,
		},
		image: path.join(__dirname, '..', 'images', 'mods'),
		archive: path.join(__dirname, '..', 'files', 'mods'),
	},
};

let upload = async (file, pathTo, character) => {
	let type;
	
	if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
		file.mv(path.join(__dirname));
		type = 'image';
		
		if (folder[pathTo].maxSize[type] < file.size) {
			return Promise.reject(new ApiError(ApiError.CODES.VERY_LARGE_IMAGE));
		}
	}
	
	if (file.mimetype === 'application/zip' || file.mimetype === 'application/gzip' || file.mimetype === 'application/gzip' || file.mimetype === 'application/x-tar' || file.mimetype === 'application/x-rar-compressed') {
		type = 'archive';
		
		if (folder[pathTo].maxSize[type] < file.size) {
			return Promise.reject(new ApiError(ApiError.CODES.VERY_LARGE_IMAGE));
		}
	}
	
	if (type !== character) {
		return Promise.reject(new ApiError(ApiError.CODES.INVALID_ATTACHMENT_FORMAT));
	}
	
	switch (pathTo) {
		case 'mod':
			await fs.writeFileSync(folder[pathTo][type] + '/' + file.md5 + '.' + file.name.split('.')[file.name.split('.').length - 1], Buffer.from(file.data, 'utf8'));
			return Promise.resolve(file.md5 + '.' + file.name.split('.')[file.name.split('.').length - 1]);
			break;
		default:
			return Promise.reject(new ApiError(ApiError.CODES.INVALID_ATTACHMENT_FORMAT));
	}
};

module.exports = upload;