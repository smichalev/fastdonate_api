const download = require('download-file');

let downloadFile = (url, name, dir) => {
	download(url, {
		directory: dir,
		filename: name
	}, function(err) {
		if (err) throw err;
	});
};

module.exports = downloadFile;
