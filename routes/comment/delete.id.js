const path = require('path');

const db = require('lib/lib.db').sequilize;
const mw = require(path.join(__dirname, '..', '..', 'mw'));

const {ApiError} = require('errors');

const Comments = require('models/comments.model');
const Mod = require('models/mod.model');

module.exports = (router) => {
  router.delete('/:id', mw.checkLogin, request);
};

let request = async (req, res, next) => {
  let dbtransaction;

  try {
    dbtransaction = await db.transaction();
    let param = {transaction: dbtransaction};

    if (!req.params.id) {
      return next(new ApiError(ApiError.CODES.INVALID_PARAMETERS));
    }

    let creator = req.session.user.id,
      comment,
      mod;

    comment = await Comments.findOne({
      where: {
        id: req.params.id
      },
      ...param
    });

    if (!comment) {
      return next(new ApiError(ApiError.CODES.NOT_FOUND));
    }

    if (comment.creator !== creator) {
      return next(new ApiError(ApiError.CODES.NOT_ENOUGH_RIGHTS));
    }

    mod = await Mod.findOne({
      where: {
        id: comment.essence
      },
      ...param
    });

    if (!mod) {
      return next(new ApiError(ApiError.CODES.SCRIPT_NOT_FOUND));
    }

    mod.comments = mod.comments - 1;

    await mod.save(param);
    await comment.destroy(param);
    await dbtransaction.commit();

    return res.send({comment});
  }
  catch (e) {
    if (dbtransaction) {
      await dbtransaction.rollback();
    }

    return next(e);
  }
};
