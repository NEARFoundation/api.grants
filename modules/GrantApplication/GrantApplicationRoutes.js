const express = require('express');

const router = express.Router();
const GrantApplicationController = require('./GrantApplicationController');

/*
 * GET (Get the first or create if it does not exist)
 */
router.get('/', GrantApplicationController.list);

/*
 * GET (Get by ID)
 */
router.get('/:id', GrantApplicationController.show);

/*
 * PUT (Save Draft)
 */
router.put('/:id', GrantApplicationController.saveDraft);

/*
 * POST (Submit)
 */
router.post('/:id', GrantApplicationController.submit);

/*
 * PUT (Set calendar interview url and date)
 */
router.put('/:id/calendly/interview', GrantApplicationController.setInterview);

/*
 * GET (Get by ID)
 */
router.get('/:id/agreement', GrantApplicationController.downloadAgreement);

module.exports = router;
