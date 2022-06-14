const express = require('express');

const router = express.Router();
const GrantApplicationController = require('./GrantApplicationController');

/*
 * GET
 */
router.get('/', GrantApplicationController.list);

/*
 * GET
 */
router.get('/:id', GrantApplicationController.show);

/*
 * PUT
 */
router.put('/:id', GrantApplicationController.update);

module.exports = router;
