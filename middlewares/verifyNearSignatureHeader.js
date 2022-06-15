/* eslint-disable no-restricted-syntax */
const { sha256 } = require('js-sha256');
const nearApi = require('near-api-js');

const verifyNearSignatureHeader = async (req, res, next) => {
  if (!req.near) {
    throw new Error('verifyNearSignatureHeader middleware should be used after the near middleware');
  }

  const accountId = req.headers['x-near-account-id'];
  const signatureString = req.headers['x-near-signature'];
  const signatureObject = JSON.parse(signatureString);
  const signatureArray = Object.keys(signatureObject).map((key) => signatureObject[key]);

  const signature = new Uint8Array(signatureArray);
  const message = new Uint8Array(sha256.array(accountId));

  const { near } = req.near;
  const account = await near.account(accountId);
  const accessKeys = await account.getAccessKeys();

  for (const accessKey of accessKeys) {
    const publicKey = nearApi.utils.key_pair.PublicKey.from(accessKey.public_key);

    if (publicKey.verify(message, signature)) {
      req.near.accountId = accountId;
      next();
      return;
    }
  }

  res.status(401).send('Unauthorized');
};

module.exports = verifyNearSignatureHeader;
