const path = require('path');

const db = require('lib/lib.db').sequilize;
const mw = require(path.join(__dirname, '..', '..', 'mw'));

const {ApiError} = require('errors');

const Users = require('models/user.model');

module.exports = (router) => {
  router.get('/:id', mw.checkSession, request);
};

let request = async (req, res, next) => {
  let dbtransaction;
  let user;
  let query = {
    where: {
      id: req.params.id
    }
  };

  if (req.session.user.id !== req.params.id) {
    query.attributes = {
      exclude: ['balance']
    };
  }

  try {
    dbtransaction = await db.transaction();
    let param = {transaction: dbtransaction};

    user = await Users.findOne(Object.assign(query, param));

    if (!user) {
      return next(new ApiError(ApiError.CODES.NOT_FOUND));
    }

    await dbtransaction.commit();

    return res.json({user});
  }
  catch (e) {
    if (dbtransaction) {
      await dbtransaction.rollback();
    }

    return next(e);
  }
};
