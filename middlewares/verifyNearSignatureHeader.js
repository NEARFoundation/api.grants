const verifyNearSignatureHeader = (req, res, next) => {
  const accountId = req.headers['x-near-account-id'];
  const signature = req.headers['x-near-signature'];

  next();
};

module.exports = verifyNearSignatureHeader;
