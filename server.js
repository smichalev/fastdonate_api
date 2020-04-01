const config = require('config');
const express = require('express');
const fileUpload = require('express-fileupload');
const session = require('express-session');
const helmet = require('helmet');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

app.use(cors());
app.use(helmet());
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(fileUpload());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: '123'
}));
require('./strategy/steam');
require('./routes')(app, express);

app.listen(config.port, () => {
  console.log('');
  console.log('[\x1b[36mFastDonate\x1b[0m] API Server was successfully started at port \033[31m' + config.port + '\x1b[0m.');
  console.log('');
});

