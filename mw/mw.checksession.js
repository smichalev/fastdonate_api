const {ApiError} = require('errors');

module.exports = (req, res, next) => {
  if (!req.session || !req.session.user) {
    return next(new ApiError(ApiError.CODES.SESSION_DIE));
  }
  return next();
};
