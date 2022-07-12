const express = require('express');

const router = express.Router();
const InvoiceController = require('./InvoiceController');
const adminAuthorizer = require('../../utilities/authorizer');

const { ADMIN_TOKEN } = process.env;

/*
 * GET (Download invoice)
 */
router.get('/api/v1/grants/:id/invoices/:invoiceId', InvoiceController.download);

/*
 * GET (Download invoice)
 */
router.get(`/admin/${ADMIN_TOKEN}/accounts/:nearId/grants/:id/invoices/:invoiceId`, adminAuthorizer, InvoiceController.download);

module.exports = router;
