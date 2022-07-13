const getGrant = require('../../utilities/getGrant');
const hellosignConfig = require('../../config/hellosign');
const hellosignService = require('../../services/hellosignService');
const { reportError } = require('../../services/errorReportingService');

/**
 * SignatureController.js
 *
 * @description :: Server-side logic for signing the contract.
 */
module.exports = {
  async embeddedSignature(req, res) {
    try {
      const grantApplication = await getGrant(req, res);
      const { appClientKey } = hellosignConfig;

      const signatureRequestUrl = await hellosignService.getSignatureRequestUrl(grantApplication.helloSignSignatureRequestIdAdmin);

      res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Admin</title>
          <style type="text/css">.body { width: auto; }</style>
        </head>
        <body>
          <h1>ADMIN // HELLO SIGN</h1>
          <script src="https://cdn.hellosign.com/public/js/embedded/v2.10.0/embedded.production.min.js"></script>
          <script>
            const client = new window.HelloSign({
              clientId: '${appClientKey}',
              skipDomainVerification: true
            });

            try {
              client.open('${signatureRequestUrl}');
            }
            catch (error) {
              console.log(error);
              alert('Error: ' + error.message);
            }
          </script>
        </body>
      </html>`);
    } catch (error) {
      reportError(error, 'Could not set embedded signature for admin');
      res.status(500).json({
        message: error.message,
      });
    }
  },
};
