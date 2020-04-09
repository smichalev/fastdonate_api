const Comments = require('models/comments.model');
const Mod = require('models/mod.model');
const path = require('path');
const mw = require(path.join(__dirname, '..', '..', 'mw'));
const uuid = require('uuid');
const {ApiError} = require('errors');

module.exports = (router) => {
  router.post('/:id', mw.checkLogin, request);
};

async function request(req, res, next) {
  if (!req.body.text || !req.params.id || !req.body.text.replace(/\s+/g, '').length) {
    return next(new ApiError(ApiError.CODES.INVALID_PARAMETERS));
  }
  if (req.body.text.length > 180) {
    return next(new ApiError(ApiError.CODES.VERY_LARGE_COMMENT));
  }
  let creator = req.session.user.id;
  let parent = req.body.parent ? req.body.parent : null;
  let comments, mod;

  try {
    mod = await Mod.findOne({
      where: {
        id: req.params.id
      }
    });
  }
  catch (e) {
    return next(e);
  }

  if (!mod) {
    return next(new ApiError(ApiError.CODES.SCRIPT_NOT_FOUND));
  }
  mod.comments = mod.comments + 1;

  try {
    await mod.save();
    comments = await Comments.create({
      id: uuid.v4(),
      essence: req.params.id,
      parent,
      creator,
      text: req.body.text
    });
  }
  catch (e) {
    return next(e);
  }

  return res.send({comments});
}
