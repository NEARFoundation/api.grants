const express = require('express');

const router = express.Router();
const InvoiceController = require('./InvoiceController');

/*
 * GET (Download invoice)
 */
router.get('/:id/invoices/:invoiceId', InvoiceController.download);

module.exports = router;
