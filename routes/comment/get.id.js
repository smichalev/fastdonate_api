const db = require('lib/lib.db').sequilize;

const {ApiError} = require('errors');

const Comments = require('models/comments.model');
const Mod = require('models/mod.model');

module.exports = (router) => {
  router.get('/:id', request);
};

let request = async (req, res, next) => {
  let dbtransaction;

  try {
    dbtransaction = await db.transaction();
    let param = {transaction: dbtransaction};

    let comments, mod;

    mod = await Mod.count({
      where: {
        id: req.params.id
      },
      ...param
    });

    if (!mod) {
      return next(new ApiError(ApiError.CODES.SCRIPT_NOT_FOUND));
    }

    comments = await Comments.findAll({
      where: {
        essence: req.params.id
      },
      include: [
        {
          association: 'Creator',
          attributes: ['id', 'login', 'avatar']
        }
      ],
      ...param
    });

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
