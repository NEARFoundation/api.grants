const getGrant = require('../../utilities/getGrant');

/**
 * InvoiceController.js
 *
 * @description :: Server-side logic for managing Invoices.
 */
module.exports = {
  async download(req, res) {
    try {
      const grantApplication = await getGrant(req, res);

      res.json(grantApplication);
    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
  },
};
