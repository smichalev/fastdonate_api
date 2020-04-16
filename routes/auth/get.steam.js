const passport = require('passport');

module.exports = (router) => {
  router.get('/steam', passport.authenticate('steam', {failureRedirect: '/'}), request);
};

let request = (req, res, next) => {
  res.redirect('/');
};
