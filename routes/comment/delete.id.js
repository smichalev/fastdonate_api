const Comments = require('models/comments.model');
const Mod = require('models/mod.model');
const path = require('path');
const mw = require(path.join(__dirname, '..', '..', 'mw'));
const uuid = require('uuid');
const {ApiError} = require('errors');

module.exports = (router) => {
  router.delete('/:id', mw.checkLogin, request);
};

async function request(req, res, next) {
  if (!req.params.id) {
    return next(new ApiError(ApiError.CODES.INVALID_PARAMETERS));
  }
  let creator = req.session.user.id;
  let comment, mod;

  try {
    comment = await Comments.findOne({
      where: {
        id: req.params.id
      }
    });
  }
  catch (e) {
    return next(e);
  }

  if (!comment) {
    return next(new ApiError(ApiError.CODES.NOT_FOUND));
  }

  if (comment.creator !== creator) {
    return next(new ApiError(ApiError.CODES.NOT_ENOUGH_RIGHTS));
  }

  try {
    mod = await Mod.findOne({
      where: {
        id: comment.essence
      }
    });
  }
  catch (e) {
    return next(e);
  }

  if (!mod) {
    return next(new ApiError(ApiError.CODES.SCRIPT_NOT_FOUND));
  }

  mod.comments = mod.comments - 1;

  try {
    await mod.save();
    await comment.destroy();
  }
  catch (e) {
    return next(e);
  }

  return res.send({comment});
}
