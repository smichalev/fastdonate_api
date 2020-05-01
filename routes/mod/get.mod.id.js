const db = require('lib/lib.db').sequilize;

const {ApiError} = require('errors');

const Mods = require('models/mod.model');

module.exports = (router) => {
  router.get('/:id', request);
};

let request = async (req, res, next) => {
  let dbtransaction;

  try {
    dbtransaction = await db.transaction();
    let param = {transaction: dbtransaction};

    let mod;

    mod = await Mods.findOne({
      where: {
        id: req.params.id
      },
      include: [
        {
          association: 'Tags',
          required: false
        },
        {
          association: 'Creator'
        }
      ],
      ...param
    });

    if (!mod) {
      return next(new ApiError(ApiError.CODES.SCRIPT_NOT_FOUND));
    }

    if (mod.cover) {
      mod.cover = '/api/images/mods/' + mod.cover;
    }
    else {
      mod.cover = null;
    }

    await dbtransaction.commit();

    return res.send({mod});
  }
  catch (e) {
    if (dbtransaction) {
      await dbtransaction.rollback();
    }

    return next(e);
  }
};
