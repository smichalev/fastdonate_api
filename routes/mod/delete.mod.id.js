const Mods = require('models/mod.model');
const Files = require('models/files.model');
const Hashmods = require('models/hashmod.model');
const Comments = require('models/comments.model');
const path = require('path');
const mw = require(path.join(__dirname, '..', '..', 'mw'));
const {ApiError} = require('errors');

module.exports = (router) => {
  router.delete('/:id', mw.checkLogin, request);
};

async function request(req, res, next) {
  let mod, files, hashmods, comments;
  try {
    mod = await Mods.findOne({
      where: {
        id: req.params.id
      }
    });
    files = await Files.findAll({
      where: {
        parent: req.params.id
      }
    });
    hashmods = Hashmods.findAll({
      where: {
        mod_id: req.params.id
      }
    });
    comments = Comments.findAll({
      where: {
        essence: req.params.id
      }
    });
  }
  catch (e) {
    return next(e);
  }
  if (!mod) {
    return next(new ApiError(ApiError.CODES.SCRIPT_NOT_FOUND));
  }
  try {
    if (req.session.user.role === 'ADMIN') {
      await mod.destroy();
      await files.destroy();
      await hashmods.destroy();
      await comments.destroy();
      return res.json({message: 'Модификация успешно удалена'});
    }
    else {
      if (mod.creator !== req.session.user.id) {
        return next(new ApiError(ApiError.CODES.NOT_ENOUGH_RIGHTS));
      }
      else {
        await mod.destroy();
        await files.destroy();
        await hashmods.destroy();
        await comments.destroy();
        return res.json({message: 'Модификация успешно удалена'});
      }
    }
  }
  catch (e) {
    return next(e);
  }
}
