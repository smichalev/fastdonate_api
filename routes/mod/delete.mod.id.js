const path = require('path');

const db = require('lib/lib.db').sequilize;
const mw = require(path.join(__dirname, '..', '..', 'mw'));

const {ApiError} = require('errors');

const Mods = require('models/mod.model');
const Files = require('models/files.model');
const Hashmods = require('models/hashmod.model');
const Comments = require('models/comments.model');

module.exports = (router) => {
  router.delete('/:id', mw.checkLogin, request);
};

let request = async (req, res, next) => {
  let dbtransaction;

  try {
    dbtransaction = await db.transaction();
    let param = {transaction: dbtransaction};

    let mod = await Mods.findOne({
      where: {
        id: req.params.id
      },
      ...param
    });

    let files = await Files.findAll({
      where: {
        parent: req.params.id
      },
      ...param
    });

    let hashmods = Hashmods.findAll({
      where: {
        mod_id: req.params.id
      },
      ...param
    });

    let comments = Comments.findAll({
      where: {
        essence: req.params.id
      },
      ...param
    });

    if (!mod) {
      return next(new ApiError(ApiError.CODES.SCRIPT_NOT_FOUND));
    }

    if (req.session.user.role === 'ADMIN') {
      await mod.destroy(param);

      if (files) await files.destroy(param);
      if (hashmods) await hashmods.destroy(param);
      if (comments) await comments.destroy(param);

      return res.json({message: 'Модификация успешно удалена'});
    }
    else {

      if (mod.creator !== req.session.user.id) {
        return next(new ApiError(ApiError.CODES.NOT_ENOUGH_RIGHTS));
      }

      else {
        await mod.destroy();

        if (files) await files.destroy(param);
        if (hashmods) await hashmods.destroy(param);
        if (comments) await comments.destroy(param);

        await dbtransaction.commit();

        return res.json({message: 'Модификация успешно удалена'});
      }
    }
  }
  catch (e) {
    if (dbtransaction) {
      await dbtransaction.rollback();
    }

    return next(e);
  }
};
