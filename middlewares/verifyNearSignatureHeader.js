const { sha256 } = require('js-sha256');

const verifyNearSignatureHeader = (req, res, next) => {
  if (!req.near) {
    throw new Error('verifyNearSignatureHeader middleware should be used after the near middleware');
  }

  const accountId = req.headers['x-near-account-id'];
  const signatureString = req.headers['x-near-signature'];
  const signatureObject = JSON.parse(signatureString);
  const signatureArray = Object.keys(signatureObject).map((key) => signatureObject[key]);

  const signature = new Uint8Array(signatureArray);
  const message = new Uint8Array(sha256.array(accountId));

  const { keyPair } = req.near;
  console.log(message);
  console.log(signature);

  const isSignatureValid = keyPair.verify(message, signature);

  console.log('isSignatureValid', isSignatureValid);

  next();
};

module.exports = verifyNearSignatureHeader;
