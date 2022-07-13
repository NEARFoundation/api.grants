const fs = require('fs');
const config = require('../config/hellosign');
// eslint-disable-next-line import/order
const hellosign = require('hellosign-sdk')({ key: config.apiKey });
const { reportError } = require('./errorReportingService');
const generateContract = require('../utilities/generateContract');
const logger = require('../utilities/logger');

const options = {
  test_mode: config.testMode,
  clientId: config.appClientKey,
  subject: config.subject,
  message: config.message,
};

module.exports = {
  async createSignatureRequest(grantApplication) {
    try {
      logger.info('Creating signature request', { nearId: grantApplication.nearId });
      const { email, firstname, lastname } = grantApplication;
      const contractPath = await generateContract(config.templatePath, grantApplication);

      const signatureRequest = await hellosign.signatureRequest.createEmbedded({
        ...options,
        files: [contractPath],
        signers: [
          {
            email_address: email,
            name: `${firstname} ${lastname}`,
          },
          {
            email_address: config.adminEmail,
            name: config.adminName,
          },
        ],
      });

      const helloSignRequestId = signatureRequest.signature_request.signature_request_id;
      const helloSignSignatureRequestId = signatureRequest.signature_request.signatures[0].signature_id;
      const helloSignSignatureRequestIdAdmin = signatureRequest.signature_request.signatures[1].signature_id;
      const helloSignRequestUrl = await this.getSignatureRequestUrl(helloSignSignatureRequestId);

      fs.unlinkSync(contractPath);

      return {
        helloSignSignatureRequestId,
        helloSignSignatureRequestIdAdmin,
        helloSignRequestUrl,
        helloSignRequestId,
      };
    } catch (error) {
      reportError(error, 'Hello sign could not create the signature request');
      return {
        helloSignSignatureRequestId: null,
        helloSignRequestUrl: null,
        helloSignRequestId: null,
      };
    }
  },
  async getSignatureRequestUrl(helloSignSignatureRequestId) {
    try {
      logger.info('Getting signature request url', { helloSignSignatureRequestId });

      const helloSignUrlRequest = await hellosign.embedded.getSignUrl(helloSignSignatureRequestId);
      const helloSignRequestUrl = helloSignUrlRequest.embedded.sign_url;

      return helloSignRequestUrl;
    } catch (error) {
      reportError(error, 'Could not get signature request url from hello sign');
      return null;
    }
  },
  async isRequestCompleted(helloSignRequestId) {
    try {
      logger.info('Checking if signature request is completed', { helloSignRequestId });
      const signatureRequest = await hellosign.signatureRequest.get(helloSignRequestId);

      const dateAgreementSignatureGrantReceiver = signatureRequest.signature_request.signatures[0].status_code === 'signed' ? new Date() : null;
      const dateAgreementSignatureGrantGiver = signatureRequest.signature_request.signatures[1].status_code === 'signed' ? new Date() : null;

      return {
        dateAgreementSignatureGrantReceiver,
        dateAgreementSignatureGrantGiver,
      };
    } catch (error) {
      reportError(error, 'Could not get satus of signature from hello sign');
      return {
        dateAgreementSignatureGrantReceiver: null,
        dateAgreementSignatureGrantGiver: null,
      };
    }
  },
  async downloadAgreement(helloSignRequestId) {
    try {
      logger.info('Downloading agreement', { helloSignRequestId });
      return new Promise((resolve) => {
        hellosign.signatureRequest.download(helloSignRequestId, { file_type: 'zip' }, (err, res) => {
          const fileName = `tmp/agreements-${Date.now()}-${Math.floor(Math.random() * 100000)}-${helloSignRequestId}.zip`;

          const file = fs.createWriteStream(fileName);

          res.pipe(file);

          file.on('finish', () => {
            file.close();
            resolve(fileName);
          });
        });
      });
    } catch (error) {
      reportError(error, 'Could not donwload agreement from hello sign');
      return null;
    }
  },
};
