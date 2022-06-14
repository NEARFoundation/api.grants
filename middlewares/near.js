const near = (nearApi) => {
  const middleware = (req, res, next) => {
    req.near = nearApi;
    next();
  };
  return middleware;
};

module.exports = near;
