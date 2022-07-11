const express = require('express');

const router = express.Router();
const MilestoneController = require('./MilestoneController');

/*
 * POST (Submit a milestone)
 */
router.post('/:id/milestones/:milestoneId', MilestoneController.update);

/*
 * PUT (Validate and save transaction hash)
 */
router.put('/:id/milestones/:milestoneId/near-transactions', MilestoneController.validateAndSaveTransactionHash);

/*
 * PUT (Set calendar interview url and date)
 */
router.put('/:id/milestones/:milestoneId/calendly/interview', MilestoneController.setInterview);

module.exports = router;
