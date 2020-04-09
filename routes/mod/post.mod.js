const Mods = require('models/mod.model');
const Hash = require('models/hash.model');
const Hashmod = require('models/hashmod.model');
const Files = require('models/files.model');
const path = require('path');
const mw = require(path.join(__dirname, '..', '..', 'mw'));
const uuid = require('uuid');
const fs = require('fs');
const {ApiError} = require('errors');
const config = require(path.join(__dirname, '..', '..', 'config'));

module.exports = (router) => {
  router.post('/', mw.checkLogin, request);
};

async function request(req, res, next) {
  let script, result, hashtags = [], promises = [], hashes = {}, imageFile, modFile;
  let {price, discount, version, title, description} = req.body;
  let hash = req.body.hash ? req.body.hash.split(',') : [];

  let imageFolder = path.join(__dirname, '..', '..', 'images');
  let fileFolder = path.join(__dirname, '..', '..', 'files');

  if (!req.files || !req.files.mod) {
    return next(new ApiError(ApiError.CODES.REQUIRED_FIELD_IS_NOT_FILLED));
  }
  if (req.files.image) {
    req.files.image.mv(path.join(__dirname));
    imageFile = req.files.image.md5 + '.' + req.files.image.name.split('.')[req.files.image.name.split('.').length - 1];
  }
  modFile = req.files.mod.md5 + '.' + req.files.mod.name.split('.')[req.files.mod.name.split('.').length - 1];

  try {
    if (req.files.image) {
      if (req.files.image.mimetype === 'image/jpeg' || req.files.image.mimetype === 'image/png') {
        await fs.writeFileSync(imageFolder + '/' + req.files.image.md5 + '.' + req.files.image.name.split('.')[req.files.image.name.split('.').length - 1], Buffer.from(req.files.image.data, 'utf8'));
      }
      else {
        return next(new ApiError(ApiError.CODES.INVALID_ATTACHMENT_FORMAT));
      }
    }
    if (req.files.mod.mimetype === 'application/zip' || req.files.mod.mimetype === 'application/gzip' || req.files.mod.mimetype === 'application/x-tar' || req.files.mod.mimetype === 'application/x-rar-compressed') {
      await fs.writeFileSync(fileFolder + '/' + req.files.mod.md5 + '.' + req.files.mod.name.split('.')[req.files.mod.name.split('.').length - 1], Buffer.from(req.files.mod.data, 'utf8'));
    }
    else {
      return next(new ApiError(ApiError.CODES.INVALID_ATTACHMENT_FORMAT));
    }
  }
  catch (e) {
    return next(e);
  }

  for (let i = 0; i < hash.length; i++) {
    if (!!!~hashtags.indexOf(hash[i])) {
      hashtags.push(hash[i]);
    }
  }

  if (hashtags.length > config.settings.maxHashtags) {
    return next(new ApiError(ApiError.CODES.MANY_HASHTAG));
  }

  if (!req.session || !req.session.user || !req.session.user.id) {
    return next(new ApiError(ApiError.CODES.SESSION_DIE));
  }
  let creator = req.session.user.id;

  price = +price;
  discount = +discount;

  if (!title || !description || !version || !creator || isNaN(price) || isNaN(discount)) {
    return next(new ApiError(ApiError.CODES.REQUIRED_FIELD_IS_NOT_FILLED));
  }

  if (price < 0) {
    return next(new ApiError(ApiError.CODES.INVALID_PRODUCT_PRICE));
  }

  if (price === 0) {
    discount = 0;
  }
  else if (discount < 0 || discount > 100) {
    return next(new ApiError(ApiError.CODES.INVALID_DISCOUNT_PERCENTAGE));
  }
  let randomID = uuid.v4();

  try {
    script = await Mods.create({
      id: randomID,
      creator,
      price,
      version,
      title,
      description,
      discount,
      cover: req.files.image ? imageFile : null
    });
  }
  catch (e) {
    return next(e);
  }

  for (let i = 0; i < hashtags.length; i++) {
    promises.push(Hash.findOrCreate({
      defaults: {id: uuid.v4(), title: hashtags[i]},
      where: {title: hashtags[i]},
      raw: true
    }));
  }

  try {
    result = await Promise.all(promises);
  }
  catch (e) {
    return next(e);
  }
  promises = [];

  for (let i = 0; i < result.length; i++) {
    promises.push(Hashmod.findOrCreate({
      defaults: {mod_id: randomID, tag_id: result[i][0].id},
      where: {mod_id: randomID, tag_id: result[i][0].id}
    }));
  }

  try {
    await Promise.all(promises);
  }
  catch (e) {
    return next(e);
  }
  promises = [];

  try {
    await Files.create({
      id: uuid.v4(),
      parent: randomID,
      creator,
      type: 'script',
      path: modFile
    });
    if (req.files.image) {
      await Files.create({
        id: uuid.v4(),
        parent: randomID,
        creator,
        type: 'cover',
        path: imageFile
      });
    }
  }
  catch (e) {
    return next(e);
  }

  try {
    script = await Mods.findOne({
      where: {
        id: randomID
      },
      include: [
        {
          association: 'Tags',
          required: false
        }
      ]
    });
  }
  catch (e) {
    return next(e);
  }

  return res.send({mod: script});
}
