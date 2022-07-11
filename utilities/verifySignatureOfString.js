const { sha256 } = require('js-sha256');
const nearApi = require('near-api-js');

const verifySignatureOfObject = async (signatureObject, messageString, accountId, near) => {
  const account = await near.account(accountId);
  const accessKeys = await account.getAccessKeys();

  const signatureArray = Object.keys(signatureObject).map((key) => signatureObject[key]);
  const signature = new Uint8Array(signatureArray);
  const message = new Uint8Array(sha256.array(messageString));

  // eslint-disable-next-line no-restricted-syntax
  for (const accessKey of accessKeys) {
    const publicKey = nearApi.utils.key_pair.PublicKey.from(accessKey.public_key);

    if (publicKey.verify(message, signature)) {
      return true;
    }
  }

  return false;
};

module.exports = verifySignatureOfObject;
