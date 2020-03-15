const fs = require('fs');
let tables = [];
fs.readdirSync('models').forEach(file => {
	if(file !== 'references.js'){
		tables[tables.length] = require('models/'+file.slice(0, -3));
		tables[tables.length-1] = tables[tables.length-1].sync({force: true});
	}
});
return Promise.all(tables).then(() => {
	console.log('TABLES SUCCESSFULLY RECREATED');
})