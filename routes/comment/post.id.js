const uuid = require('uuid');
const path = require('path');

const db = require('lib/lib.db').sequilize;
const mw = require(path.join(__dirname, '..', '..', 'mw'));

const {ApiError} = require('errors');

const Comments = require('models/comments.model');
const Mod = require('models/mod.model');

module.exports = (router) => {
  router.post('/:id', mw.checkLogin, request);
};

let request = async (req, res, next) => {
  let dbtransaction;

  try {
    dbtransaction = await db.transaction();
    let param = {transaction: dbtransaction};

    if (!req.body.text || !req.params.id || !req.body.text.replace(/\s+/g, '').length) {
      return next(new ApiError(ApiError.CODES.INVALID_PARAMETERS));
    }

    if (req.body.text.length > 180) {
      return next(new ApiError(ApiError.CODES.VERY_LARGE_COMMENT));
    }

    let comments,
      mod,
      essence = req.params.id,
      parent = req.body.parent ? req.body.parent : null,
      creator = req.session.user.id;

    mod = await Mod.findOne({
      where: {
        id: req.params.id
      },
      ...param
    });

    if (!mod) {
      return next(new ApiError(ApiError.CODES.SCRIPT_NOT_FOUND));
    }

    mod.comments = mod.comments + 1;

    await mod.save(param);

    comments = await Comments.create({
      id: uuid.v4(),
      essence: req.params.id,
      parent,
      creator,
      text: req.body.text
    }, param);

    await dbtransaction.commit();

    return res.send({comments});
  }
  catch (e) {
    if (dbtransaction) {
      await dbtransaction.rollback();
    }

    return next(e);
  }
};
