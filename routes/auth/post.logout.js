module.exports = (router) => {
  router.post('/logout', request);
};

let request = (req, res, next) => {
  try {
    if (req.session.user) {
      req.session = null;
    }

    return res.json({message: 'ok'});
  }
  catch (e) {
    return next(e);
  }
};
