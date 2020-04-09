const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('config');
const path = require('path');
const {ApiError} = require('errors');
const User = require(path.join(__dirname, '..', 'models', 'user.model'));
const dictionary = {
  RU: require(path.join(__dirname, '..', 'locales', 'ru.json')),
  EN: require(path.join(__dirname, '..', 'locales', 'en.json'))
};

module.exports = (app, express) => {
  app.use(passport.initialize());
  app.use('/api/auth', require(path.join(__dirname, 'auth')));
  app.use('/api/mod', require(path.join(__dirname, 'mod')));
  app.use('/api/comment', require(path.join(__dirname, 'comment')));
  app.use('/api/users', require(path.join(__dirname, 'users')));
  app.get('/api/', (req, res) => {
    res.render('index');
  });
  app.use('/api/images', express.static(path.join(__dirname, '..', 'images')));
  app.get('/api/profile', async (req, res, next) => {
    if (!req.headers.authorization) {
      return next(new ApiError(ApiError.CODES.YOU_ARE_NOT_LOGIN));
    }
    if (!req.session || !req.session.user) {
      return next(new ApiError(ApiError.CODES.SESSION_DIE));
    }
    if (req.headers.authorization.split(' ').length === 2 && req.headers.authorization.split(' ')[0] === 'Bearer' && req.headers.authorization.split(' ')[1].split('.').length === 3) {
      let profile, user;
      try {
        profile = await jwt.decode(req.headers.authorization.split(' ')[1], config.authorization.secretKey);
      }
      catch (e) {
        return next(e);
      }

      if (!profile) {
        return next(new ApiError(ApiError.CODES.TOKEN_NOT_VALID));
      }

      try {
        user = await User.findOne({
          where: {
            id: profile.id
          },
          raw: true
        });
      }
      catch (e) {
        return next(e);
      }

      if (!user) {
        return next(new ApiError(ApiError.CODES.USER_NOT_FOUND));
      }

      return res.status(200).send({profile: user});
    }
    else {
      return next(new ApiError(ApiError.CODES.TOKEN_NOT_VALID));
    }
  });
  app.use((err, req, res, next) => {
    if (!err) return next();
    let lang = 'EN';

    if (req.session && req.session.user && req.session.user.country) {
      if (req.session.user.country === 'RU') {
        lang = req.session.user.country;
      }
    }
    let response = {};
    if (err.code !== null && err.code !== 'undefined') response.code = err.code;
    let message = err.message || 'Unknown error';
    let status = err.status || 500;
    if (dictionary[lang].errors[message]) {
      response.message = dictionary[lang].errors[message];
    }
    else {
      response.message = message;
    }
    return res.status(status).send(response);
  });

  app.use((req, res) => {
    let lang = 'EN';

    if (req.session && req.session.user && req.session.user.country) {
      if (req.session.user.country === 'RU') {
        lang = req.session.user.country;
      }
    }
    let error = new ApiError(ApiError.CODES.NOT_FOUND);
    if (dictionary[lang].errors[error.message]) {
      error.message = dictionary[lang].errors[error.message];
    }

    return res.status(error.status).send({message: error.message});
  });
};
