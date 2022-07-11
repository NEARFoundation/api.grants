const verifySignatureOfString = require('./verifySignatureOfString');

const verifySignatureOfObject = async (signatureObject, messageObject, accountId, near) => {
  const messageString = JSON.stringify(messageObject);

  return verifySignatureOfString(signatureObject, messageString, accountId, near);
};

module.exports = verifySignatureOfObject;
