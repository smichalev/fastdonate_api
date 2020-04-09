const Comments = require('models/comments.model');
const Mod = require('models/mod.model');
const {ApiError} = require('errors');

module.exports = (router) => {
  router.get('/:id', request);
};

async function request(req, res, next) {
  let comments, mod;

  try {
    mod = await Mod.count({
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

  try {
    comments = await Comments.findAll({
      where: {
        essence: req.params.id
      },
      include: [
        {
          association: 'Creator',
          attributes: ['id', 'login', 'avatar']
        }
      ]
    });
  }
  catch (e) {
    return next(e);
  }

  return res.send({comments});
}
