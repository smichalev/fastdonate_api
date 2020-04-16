const path = require('path');
const jwt = require('jsonwebtoken');

const {ApiError} = require('errors');
const config = require(path.join(__dirname, '..', 'config'));

const User = require(path.join(__dirname, '..', 'models', 'user.model'));

module.exports = async (req, res, next) => {

  if (!req.headers.authorization) {
    return next(new ApiError(ApiError.CODES.YOU_ARE_NOT_LOGIN));
  }

  if (!req.session || !req.session.user) {
    return next(new ApiError(ApiError.CODES.SESSION_DIE));
  }

  if (req.headers.authorization.split(' ').length !== 2
      || req.headers.authorization.split(' ')[0] !== 'Bearer'
      || req.headers.authorization.split(' ')[1].split('.').length !== 3) {
    return next(new ApiError(ApiError.CODES.TOKEN_NOT_VALID));
  }

  let profile, user;

  try {
    profile = await jwt.decode(req.headers.authorization.split(' ')[1], config.authorization.secretKey);
  }
  catch (e) {
    return next(new ApiError(ApiError.CODES.TOKEN_NOT_VALID));
  }

  if (!profile || !profile.id || !profile.steamid || !profile.profile) {
    return next(new ApiError(ApiError.CODES.TOKEN_NOT_VALID));
  }

  try {
    user = await User.findOne({
      where: {
        id: profile.id,
        steamid: profile.steamid,
        profile: profile.profile
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

  return next();
};
