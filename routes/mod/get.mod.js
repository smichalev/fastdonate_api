const path = require('path');
const Mod = require('models/mod.model');
const config = require(path.join(__dirname, '..', '..', 'config'));
const {ApiError} = require('errors');

require('models/references');

module.exports = (router) => {
  router.get('/', request);
};

async function request(req, res, next) {
  let scripts, count;
  let limit = config.settings.maxCountElementOnPage;
  let query = {};

  try {
    if (req.query.page) {
      if (!/^\d+$/.test(req.query.page) || req.query.page < 0) {
        return next(new ApiError(ApiError.CODES.INVALID_PARAMETERS));
      }
      req.query.page = +req.query.page;
      query.limit = limit;
      if (req.query.page === 0 || req.query.page === 1) {
        query.offset = 0;
      }
      else {
        query.offset = (req.query.page - 1) * query.limit;
      }
    }
    else {
      query.limit = limit;
      query.offset = 0;
    }
    query.include = [
      {
        association: 'Creator',
        attributes: ['id', 'login', 'avatar']
      },
      {
        association: 'Tags',
        required: false
      }
    ];

    count = await Mod.count({});
    scripts = await Mod.findAll(query);
  }
  catch (e) {
    return next(e);
  }

  let pages = Math.ceil(count / limit);

  if (!scripts.length && count) {
    return next(new ApiError(ApiError.CODES.PAGE_NOT_FOUND));
  }
  let page;
  if (!req.query.page || req.query.page === 0 || req.query.page === 1) {
    page = 1;
  }
  else {
    page = req.query.page;
  }

  for (let i = 0; i < scripts.length; i++) {
    if (scripts[i].cover) {
      scripts[i].cover = '/api/images/' + scripts[i].cover;
    }
    else {
      scripts[i].cover = null;
    }
  }

  return res.send({mods: scripts, page, pages});
};
