const Mods = require('models/mod.model');
const {ApiError} = require('errors');

module.exports = (router) => {
  router.get('/:id', request);
};

async function request(req, res, next) {
  let mod;
  try {
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
      ]
    });
  }
  catch (e) {
    return next(e);
  }

  if (!mod) {
    return next(new ApiError(ApiError.CODES.SCRIPT_NOT_FOUND));
  }
  if (mod.cover) {
    mod.cover = '/api/images/' + mod.cover;
  }
  else {
    mod.cover = null;
  }
  return res.send({mod});
}
