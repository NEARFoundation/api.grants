const config = require('../config/hellosign');
// eslint-disable-next-line import/order
const hellosign = require('hellosign-sdk')({ key: config.apiKey });

const options = {
  test_mode: config.testMode,
  clientId: config.appClientKey,
  subject: config.subject,
  message: config.message,
  files: [config.filePath],
};

module.exports = {
  async createSignatureRequest(email, fullname) {
    try {
      const signatureRequest = await hellosign.signatureRequest.createEmbedded({
        ...options,
        signers: [
          {
            email_address: email,
            name: fullname,
          },
        ],
      });

      const signature = signatureRequest.signature_request.signatures[0];
      const helloSignRequestId = signature.signature_id;
      const helloSignRequestUrl = hellosign.embedded.getSignUrl(helloSignRequestId);

      return {
        helloSignRequestId,
        helloSignRequestUrl,
      };
    } catch (err) {
      console.log(err);
      return {
        helloSignRequestId: null,
        helloSignRequestUrl: null,
      };
    }
  },
};
