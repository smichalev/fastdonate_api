const Users = require('models/user.model');
const path = require('path');
const mw = require(path.join(__dirname, '..', '..', 'mw'));
const {ApiError} = require('errors');

module.exports = (router) => {
  router.get('/:id', mw.checkSession, request);
};

async function request(req, res, next) {
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
    user = await Users.findOne(query);

    if (!user) {
      return next(new ApiError(ApiError.CODES.NOT_FOUND));
    }
    return res.json({user});
  }
  catch (e) {
    return next(e);
  }
}
