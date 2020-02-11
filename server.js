const config = require('config');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

app.use(cors());
app.use(helmet());
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

require('./strategy/steam');
require('./routes')(app);

app.listen(config.port, () => {
	console.log(`[PORT: ${ config.port }] Server start!`);
});
