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
 * POST
 */
router.post('/', GrantApplicationController.create);

/*
 * PUT
 */
router.put('/:id', GrantApplicationController.update);

/*
 * DELETE
 */
router.delete('/:id', GrantApplicationController.remove);

module.exports = router;
