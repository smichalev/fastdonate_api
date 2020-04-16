const {ApiError} = require('errors');

module.exports = (roles = []) => {
  return (req, res, next) => {
    return !!~roles.indexOf(req.session.user.role)
           ? next()
           : next(new ApiError(ApiError.CODES.NOT_ENOUGH_RIGHTS));
  };
};
