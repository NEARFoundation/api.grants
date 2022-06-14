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

module.exports = router;
