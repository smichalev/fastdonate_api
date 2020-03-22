const path = require('path');
const dictionary = {
	RU: require(path.join(__dirname, '..', 'locales', 'ru.json')),
	EN: require(path.join(__dirname, '..', 'locales', 'en.json'))
};

function translate(lang = 'EN', phrase) {
	if (Object.keys(arguments).length !== 2) {
		throw new Error('Function can take only 2 arguments');
	}
	if (!phrase) {
		throw new Error('Phrase is required')
	}
	if (!dictionary[lang]) {
		lang = 'EN';
	}
	if (!dictionary[lang][phrase]) {
		throw new Error('Phrase not found')
	}
	return dictionary[lang][phrase];
}

module.exports = translate;



