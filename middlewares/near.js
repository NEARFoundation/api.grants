const near = (nearApi) => {
  const middleware = (req, res, next) => {
    req.locals = nearApi;
    console.log(req.locals);
    next();
  };
  return middleware;
};

module.exports = near;
