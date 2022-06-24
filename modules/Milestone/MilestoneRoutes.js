const express = require('express');

const router = express.Router();
const MilestoneController = require('./MilestoneController');

/*
 * POST (Submit a milestone)
 */
router.post('/:milestoneId', MilestoneController.update);

/*
 * PUT (Validate and save transaction hash)
 */
router.put('/:milestoneId/near-transactions', MilestoneController.validateAndSaveTransactionHash);

/*
 * PUT (Set calendar interview url and date)
 */
router.put('/:milestoneId/calendly/interview', MilestoneController.setInterview);

module.exports = router;
