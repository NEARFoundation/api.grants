// const fs = require('fs');
const getGrant = require('../../utilities/getGrant');
const invoiceConfig = require('../../config/invoice');
const InvoiceGenerator = require('./InvoiceGenerator');

/**
 * InvoiceController.js
 *
 * @description :: Server-side logic for managing Invoices.
 */
module.exports = {
  async download(req, res) {
    try {
      const grantApplication = await getGrant(req, res);
      const { invoiceId } = req.params;

      const payment = grantApplication.payments[invoiceId];

      if (!payment) {
        throw new Error('Payment not found');
      }

      const filename = `${grantApplication.nearId}-${grantApplication.id}-${invoiceId}.pdf`;
      const invoice = await InvoiceGenerator.createInvoice(filename, payment, grantApplication, invoiceId, invoiceConfig);

      console.log(invoice);

      res.download(filename, filename, () => {
        // fs.unlinkSync(filename);
      });
    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
  },
};
