const config = require('../config/hellosign');
// eslint-disable-next-line import/order
const hellosign = require('hellosign-sdk')({ key: config.apiKey });

const options = {
  test_mode: config.testMode,
  clientId: config.appClientKey,
  subject: config.subject,
  message: config.message,
  files: [config.templatePath],
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
      const helloSignRequestId = signatureRequest.signature_request.signature_request_id;
      const helloSignSignatureRequestId = signature.signature_id;
      const helloSignRequestUrl = await this.getSignatureRequestUrl(helloSignSignatureRequestId);

      return {
        helloSignSignatureRequestId,
        helloSignRequestUrl,
        helloSignRequestId,
      };
    } catch (err) {
      console.log(err);
      return {
        helloSignSignatureRequestId: null,
        helloSignRequestUrl: null,
        helloSignRequestId: null,
      };
    }
  },
  async getSignatureRequestUrl(helloSignSignatureRequestId) {
    try {
      const helloSignUrlRequest = await hellosign.embedded.getSignUrl(helloSignSignatureRequestId);
      const helloSignRequestUrl = helloSignUrlRequest.embedded.sign_url;

      return helloSignRequestUrl;
    } catch (err) {
      console.log(err);
      return null;
    }
  },
  async isRequestCompleted(helloSignRequestId) {
    try {
      const signatureRequest = await hellosign.signatureRequest.get(helloSignRequestId);

      return {
        isCompleted: signatureRequest.signature_request.is_complete,
      };
    } catch (err) {
      console.log(err);
      return {
        isCompleted: false,
      };
    }
  },
};
