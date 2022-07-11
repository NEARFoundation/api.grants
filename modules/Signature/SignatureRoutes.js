const express = require('express');

const router = express.Router();
const SignatureController = require('./SignatureController');

const { ADMIN_TOKEN } = process.env;

/*
 * GET (Download invoice)
 */
router.get(`/admin/${ADMIN_TOKEN}/accounts/:nearId/grants/:id/agreement/signature`, SignatureController.embeddedSignature);

module.exports = router;
